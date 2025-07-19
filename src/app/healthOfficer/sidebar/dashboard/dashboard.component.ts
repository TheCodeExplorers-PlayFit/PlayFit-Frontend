// dashboard.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

interface WeeklyAppointmentData {
  week: string;
  total: number;
}

interface ApiResponse {
  success: boolean;
  data: WeeklyAppointmentData[];
}

interface TodaysAppointment {
  id: string;
  time: string;
  name: string;
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Canceled' | 'Approved' | 'Pending';
  avatar: string;
  email?: string;
  mobile_number?: string;
}

interface TodaysAppointmentsResponse {
  success: boolean;
  data: TodaysAppointment[];
}

interface AppointmentStats {
  total: number;
  today: number;
  thisWeek: number;
  approved: number;
}

interface StatsResponse {
  success: boolean;
  data: AppointmentStats;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('appointmentsChart', { static: true })
  private chartRef!: ElementRef;

  private chart?: Chart;

  // Configuration
  private readonly healthOfficerId = '22'; // Replace with dynamic value from auth service
  private readonly baseUrl = 'http://localhost:5000/api/appointments';

  // Data properties
  weeklyData: WeeklyAppointmentData[] = [];
  todaysAppointments: TodaysAppointment[] = [];
  appointmentStats: AppointmentStats = {
    total: 0,
    today: 0,
    thisWeek: 0,
    approved: 0
  };

  // Loading states
  chartLoading = false;
  appointmentsLoading = false;
  statsLoading = false;

  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadAllData();
  }

  refresh() {
    this.loadAllData();
  }

  private loadAllData() {
    this.loadChart();
    this.loadTodaysAppointments();
    this.loadAppointmentStats();
  }

  private loadChart() {
    this.chartLoading = true;
    const url = `${this.baseUrl}/weekly-summary-raw/${this.healthOfficerId}`;
    
    this.http.get<ApiResponse>(url).subscribe({
      next: (res) => {
        this.chartLoading = false;
        
        if (!res.success || !res.data.length) {
          console.warn('No data for chart');
          this.weeklyData = [];
          this.createEmptyChart();
          return;
        }

        // store for stats
        this.weeklyData = res.data;

        const labels = res.data.map(d => d.week);
        const totals = res.data.map(d => d.total);

        // destroy previous instance
        this.chart?.destroy();

        this.chart = new Chart(this.chartRef.nativeElement, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Appointments',
              data: totals,
              backgroundColor: 'rgba(98, 0, 238, 0.7)',
              borderColor: 'rgba(98, 0, 238, 1)',
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#6200EE',
                borderWidth: 1,
                cornerRadius: 8,
              }
            },
            scales: {
              y: { 
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  color: '#666'
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: '#666'
                }
              }
            }
          }
        });
      },
      error: (error) => {
        this.chartLoading = false;
        console.error('Error loading chart data:', error);
        this.weeklyData = [];
        this.createEmptyChart();
      }
    });
  }

  private createEmptyChart() {
    this.chart?.destroy();
    
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['No Data'],
        datasets: [{
          label: 'Appointments',
          data: [0],
          backgroundColor: 'rgba(200, 200, 200, 0.3)',
          borderColor: 'rgba(200, 200, 200, 0.5)',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  private loadTodaysAppointments() {
    this.appointmentsLoading = true;
    const url = `${this.baseUrl}/today/${this.healthOfficerId}`;
    
    this.http.get<TodaysAppointmentsResponse>(url).subscribe({
      next: (res) => {
        this.appointmentsLoading = false;
        
        if (res.success) {
          this.todaysAppointments = res.data;
          console.log('Today\'s appointments loaded:', this.todaysAppointments);
        } else {
          console.warn('Failed to load today\'s appointments');
          this.todaysAppointments = [];
        }
      },
      error: (error) => {
        this.appointmentsLoading = false;
        console.error('Error loading today\'s appointments:', error);
        this.todaysAppointments = [];
        
        // Remove mock data fallback - show empty state instead
        // this.loadMockAppointments();
      }
    });
  }

  private loadAppointmentStats() {
    this.statsLoading = true;
    const url = `${this.baseUrl}/stats/${this.healthOfficerId}`;
    
    this.http.get<StatsResponse>(url).subscribe({
      next: (res) => {
        this.statsLoading = false;
        
        if (res.success) {
          this.appointmentStats = res.data;
          console.log('Appointment stats loaded:', this.appointmentStats);
        } else {
          console.warn('Failed to load appointment stats');
        }
      },
      error: (error) => {
        this.statsLoading = false;
        console.error('Error loading appointment stats:', error);
      }
    });
  }

  // Stats methods - now use real data
  getTotalAppointments(): number {
    return this.appointmentStats.total || this.weeklyData.reduce((sum, d) => sum + d.total, 0);
  }

  getAveragePerWeek(): number {
    if (!this.weeklyData.length) return 0;
    return Math.round(this.getTotalAppointments() / this.weeklyData.length);
  }

  getPeakWeek(): string {
    if (!this.weeklyData.length) return '-';
    const peak = this.weeklyData.reduce((prev, curr) => 
      curr.total > prev.total ? curr : prev
    );
    return peak.week;
  }

  getGrowthTrend(): string {
    if (this.weeklyData.length < 2) return 'N/A';
    const first = this.weeklyData[0].total;
    const last = this.weeklyData[this.weeklyData.length - 1].total;
    if (last > first) return 'Upward';
    if (last < first) return 'Downward';
    return 'Stable';
  }

  getTodayCount(): number {
    return this.appointmentStats.today;
  }

  getThisWeekCount(): number {
    return this.appointmentStats.thisWeek;
  }

  getApprovedCount(): number {
    return this.appointmentStats.approved;
  }

  // UI methods
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'scheduled':
      case 'approved':
        return 'status-scheduled';
      case 'canceled':
      case 'cancelled':
        return 'status-canceled';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }

  getReasonClass(reason: string): string {
    const reasonLower = reason.toLowerCase();
    if (reasonLower.includes('injury')) {
      return 'reason-injury';
    } else if (reasonLower.includes('vaccination') || reasonLower.includes('immunization')) {
      return 'reason-vaccination';
    } else if (reasonLower.includes('health check') || reasonLower.includes('checkup')) {
      return 'reason-health-check';
    } else if (reasonLower.includes('fitness') || reasonLower.includes('assessment')) {
      return 'reason-fitness';
    } else {
      return 'reason-default';
    }
  }

  viewAllAppointments(): void {
    // Navigate to appointments page or show modal
    console.log('View all appointments clicked');
    // Example: this.router.navigate(['/appointments']);
  }

  // Loading state getters
  get isLoading(): boolean {
    return this.chartLoading || this.appointmentsLoading || this.statsLoading;
  }

  get hasAppointmentsToday(): boolean {
    return this.todaysAppointments.length > 0;
  }

  get hasWeeklyData(): boolean {
    return this.weeklyData.length > 0;
  }
}