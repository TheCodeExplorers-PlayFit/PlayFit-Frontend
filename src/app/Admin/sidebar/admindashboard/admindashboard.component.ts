import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart, ChartConfiguration, ChartData } from 'chart.js/auto';

// Interfaces for dashboard data
interface DashboardStats {
  totalUsers: number;
  usersByRole: {
    player: number;
    coach: number;
    stadiumOwner: number;
    medicalOfficer: number;
  };
  totalRevenue: number;
  monthlyRevenue: number[];
  totalBookings: number;
  injuries: {
    total: number;
    minor: number;
    moderate: number;
    severe: number;
  };
  averageRating: number;
  totalAppointments: number;
  activeHealthOfficers: number;
}

interface RecentActivity {
  icon: string;
  iconClass: string;
  text: string;
  time: string;
  type: 'user' | 'payment' | 'injury' | 'booking' | 'rating';
}

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  // Use public API that doesn't require authentication
  private apiUrl = 'http://localhost:5000/api/public';

  // Fixed: Add currentTime property for date pipe
  currentTime = new Date();
  private timeInterval: any;

  // Dashboard data properties
  dashboardStats: DashboardStats = {
    totalUsers: 0,
    usersByRole: { player: 0, coach: 0, stadiumOwner: 0, medicalOfficer: 0 },
    totalRevenue: 0,
    monthlyRevenue: Array(12).fill(0),
    totalBookings: 0,
    injuries: { total: 0, minor: 0, moderate: 0, severe: 0 },
    averageRating: 0,
    totalAppointments: 0,
    activeHealthOfficers: 0
  };

  recentActivities: RecentActivity[] = [];
  loading = true;
  error: string | null = null;

  // Chart instances
  private userChart: Chart | null = null;
  private revenueChart: Chart | null = null;

  ngOnInit(): void {
    // Fixed: Update current time every minute
    this.updateCurrentTime();
    this.timeInterval = setInterval(() => {
      this.updateCurrentTime();
    }, 60000); // Update every minute

    // Test API connection first
    this.testApiConnection();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    // Clean up chart instances
    if (this.userChart) {
      this.userChart.destroy();
    }
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    
    // Fixed: Clean up time interval
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  // Fixed: Method to update current time
  private updateCurrentTime(): void {
    this.currentTime = new Date();
  }

  // Get current time for template (alternative approach)
  getCurrentTime(): Date {
    return new Date();
  }

  // Get authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private testApiConnection(): void {
    console.log('Testing API connection...');
    const headers = this.getAuthHeaders();
    this.http.get(`${this.apiUrl.replace('/admin', '')}/test`, { headers }).subscribe({
      next: (response) => {
        console.log('✅ API Connection successful:', response);
      },
      error: (error) => {
        console.error('❌ API Connection failed:', error);
        if (error.status === 401) {
          console.error('Authentication failed - check if user is logged in');
        } else {
          console.error('Make sure your backend server is running on port 5000');
        }
      }
    });
  }

  private async loadDashboardData(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;
      
      // Load data from public API (no auth required)
      const [dashboardStats, recentActivities] = await Promise.all([
        this.loadDashboardStats(),
        this.loadRecentActivities()
      ]);

      this.dashboardStats = dashboardStats;
      this.recentActivities = recentActivities;

      // Create charts after data is loaded
      setTimeout(() => {
        this.createUserChart();
        this.createRevenueChart();
      }, 100);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.error = 'Failed to load dashboard data from server. Please check your API connection.';
    } finally {
      this.loading = false;
    }
  }

  private async loadDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await this.http.get<any>(`${this.apiUrl}/dashboard-stats`).toPromise();
      console.log('Dashboard Stats Response:', response);
      
      if (response?.success) {
        const data = response.data;
        return {
          totalUsers: data.users.totalUsers || 0,
          usersByRole: data.users.usersByRole || { player: 0, coach: 0, stadiumOwner: 0, medicalOfficer: 0 },
          totalRevenue: data.revenue.totalRevenue || 0,
          monthlyRevenue: data.revenue.monthlyRevenue || Array(12).fill(0),
          totalBookings: data.revenue.totalBookings || 0,
          injuries: data.injuries || { total: 0, minor: 0, moderate: 0, severe: 0 },
          averageRating: data.rating.averageRating || 0,
          totalAppointments: data.appointments.totalAppointments || 0,
          activeHealthOfficers: data.appointments.activeHealthOfficers || 0
        };
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      throw error;
    }
  }

  private loadUserStatistics(): Promise<any> {
    return this.http.get<any>(`${this.apiUrl}/user-statistics`).toPromise()
      .then(response => {
        console.log('User Statistics Response:', response); // Debug log
        if (response?.success) {
          const data = response.data;
          return {
            totalUsers: data.totalUsers || 0,
            usersByRole: {
              player: data.usersByRole?.player || 0,
              coach: data.usersByRole?.coach || 0,
              stadiumOwner: data.usersByRole?.stadiumOwner || 0,
              medicalOfficer: data.usersByRole?.medicalOfficer || 0
            }
          };
        }
        console.error('User statistics API returned unsuccessful response:', response);
        return { totalUsers: 0, usersByRole: { player: 0, coach: 0, stadiumOwner: 0, medicalOfficer: 0 } };
      })
      .catch(error => {
        console.error('Error calling user statistics API:', error);
        // Check if it's a CORS or network error
        if (error.status === 0) {
          console.error('Network error - check if backend server is running on port 5000');
        }
        return { totalUsers: 0, usersByRole: { player: 0, coach: 0, stadiumOwner: 0, medicalOfficer: 0 } };
      });
  }

  private loadRevenueStatistics(): Promise<any> {
    return this.http.get<any>(`${this.apiUrl}/revenue-statistics`).toPromise()
      .then(response => {
        if (response?.success) {
          const data = response.data;
          return {
            totalRevenue: data.totalRevenue || 0,
            monthlyRevenue: data.monthlyRevenue || Array(12).fill(0),
            totalBookings: data.totalBookings || 0
          };
        }
        return { totalRevenue: 0, monthlyRevenue: Array(12).fill(0), totalBookings: 0 };
      })
      .catch(() => ({ totalRevenue: 0, monthlyRevenue: Array(12).fill(0), totalBookings: 0 }));
  }

  private loadInjuryStatistics(): Promise<any> {
    return this.http.get<any>(`${this.apiUrl}/injury-statistics`).toPromise()
      .then(response => {
        if (response?.success) {
          const data = response.data;
          return {
            injuries: {
              total: data.total || 0,
              minor: data.minor || 0,
              moderate: data.moderate || 0,
              severe: data.severe || 0
            }
          };
        }
        return { injuries: { total: 0, minor: 0, moderate: 0, severe: 0 } };
      })
      .catch(() => ({ injuries: { total: 0, minor: 0, moderate: 0, severe: 0 } }));
  }

  private loadRatingStatistics(): Promise<any> {
    return this.http.get<any>(`${this.apiUrl}/rating-statistics`).toPromise()
      .then(response => {
        if (response?.success) {
          const data = response.data;
          return {
            averageRating: data.averageRating || 0
          };
        }
        return { averageRating: 0 };
      })
      .catch(() => ({ averageRating: 0 }));
  }

  private loadAppointmentStatistics(): Promise<any> {
    return this.http.get<any>(`${this.apiUrl}/appointment-statistics`).toPromise()
      .then(response => {
        if (response?.success) {
          const data = response.data;
          return {
            totalAppointments: data.totalAppointments || 0,
            activeHealthOfficers: data.activeHealthOfficers || 0
          };
        }
        return { totalAppointments: 0, activeHealthOfficers: 0 };
      })
      .catch(() => ({ totalAppointments: 0, activeHealthOfficers: 0 }));
  }

  private loadRecentActivities(): Promise<RecentActivity[]> {
    return this.http.get<any>(`${this.apiUrl}/recent-activities`).toPromise()
      .then(response => {
        if (response?.success && response.data) {
          return response.data.map((activity: any) => ({
            icon: this.getActivityIcon(activity.type),
            iconClass: activity.type,
            text: activity.description,
            time: this.formatTimeAgo(activity.created_at),
            type: activity.type
          }));
        }
        return this.getDefaultActivities();
      })
      .catch(() => this.getDefaultActivities());
  }

  private getDefaultActivities(): RecentActivity[] {
    return [
      { icon: '👤', iconClass: 'user', text: 'New player registered recently', time: '2 hours ago', type: 'user' },
      { icon: '💰', iconClass: 'payment', text: 'Payment completed successfully', time: '3 hours ago', type: 'payment' },
      { icon: '🏥', iconClass: 'injury', text: 'Injury report submitted', time: '5 hours ago', type: 'injury' },
      { icon: '📅', iconClass: 'booking', text: 'Session booking made', time: '6 hours ago', type: 'booking' },
      { icon: '⭐', iconClass: 'rating', text: 'New rating submitted', time: '8 hours ago', type: 'rating' }
    ];
  }

  private createUserChart(): void {
    const canvas = document.getElementById('userChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.userChart) {
      this.userChart.destroy();
    }

    this.userChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Players', 'Coaches', 'Stadium Owners', 'Medical Officers'],
        datasets: [{
          data: [
            this.dashboardStats.usersByRole.player,
            this.dashboardStats.usersByRole.coach,
            this.dashboardStats.usersByRole.stadiumOwner,
            this.dashboardStats.usersByRole.medicalOfficer
          ],
          backgroundColor: [
            '#000080',
            '#1a1a5c',
            '#3333a0',
            '#4d4db3'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  private createRevenueChart(): void {
    const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue ($)',
          data: this.dashboardStats.monthlyRevenue,
          borderColor: '#000080',
          backgroundColor: 'rgba(0, 0, 128, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + Number(value).toLocaleString();
              }
            }
          }
        }
      }
    });
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  getStarDisplay(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  }

  private getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'user': '👤',
      'payment': '💰',
      'injury': '🏥',
      'booking': '📅',
      'rating': '⭐',
      'announcement': '📢',
      'approval': '✅'
    };
    return icons[type] || '📋';
  }

  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  }

  // Navigation methods for quick actions
  navigateToUserManagement(): void {
    // This will be handled by routerLink in template
  }

  navigateToApprovals(): void {
    // This will be handled by routerLink in template
  }

  navigateToRatings(): void {
    // This will be handled by routerLink in template
  }

  navigateToReports(): void {
    // This will be handled by routerLink in template
  }

  navigateToAnnouncements(): void {
    // This will be handled by routerLink in template
  }

  navigateToSystemMaintenance(): void {
    // This will be handled by routerLink in template
  }

  // Refresh dashboard data
  refreshDashboard(): void {
    this.loadDashboardData();
  }

  // Get severity class for injury numbers
  getInjurySeverityClass(severity: string): string {
    const classes: { [key: string]: string } = {
      'minor': 'severity-minor',
      'moderate': 'severity-moderate',
      'severe': 'severity-severe'
    };
    return classes[severity] || '';
  }

  // Calculate percentages for better data visualization
  getUserRolePercentage(role: keyof typeof this.dashboardStats.usersByRole): number {
    if (this.dashboardStats.totalUsers === 0) return 0;
    return Math.round((this.dashboardStats.usersByRole[role] / this.dashboardStats.totalUsers) * 100);
  }

  getInjurySeverityPercentage(severity: 'minor' | 'moderate' | 'severe'): number {
    if (this.dashboardStats.injuries.total === 0) return 0;
    return Math.round((this.dashboardStats.injuries[severity] / this.dashboardStats.injuries.total) * 100);
  }

  // Health and safety metrics
  getHealthSafetyScore(): number {
    // Calculate a health safety score based on injury severity distribution
    const total = this.dashboardStats.injuries.total;
    if (total === 0) return 100;
    
    const minorWeight = 0.1;
    const moderateWeight = 0.5;
    const severeWeight = 1.0;
    
    const weightedScore = (
      this.dashboardStats.injuries.minor * minorWeight +
      this.dashboardStats.injuries.moderate * moderateWeight +
      this.dashboardStats.injuries.severe * severeWeight
    ) / total;
    
    return Math.max(0, Math.round(100 - (weightedScore * 100)));
  }

  // Quick stats for display
  getQuickStats() {
    return {
      userGrowthRate: '+12%', // This would come from API
      revenueGrowthRate: '+18%', // This would come from API
      bookingGrowthRate: '+8%', // This would come from API
      safetyScore: this.getHealthSafetyScore() + '%'
    };
  }
}