import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StadiumOwnerAnnouncementService } from '../../services/stadium-owner-announcement/stadium-owner-announcement.service';
import { Notice } from '../../models/notice.model';
import Chart from 'chart.js/auto'; // Ensure Chart.js is imported


interface Card {
  subtitle: string;
  text: string;
  backgroundColor: string;
  route: string;
  statusClass?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  marginLeft = '5px';
  marginTop = '78px';
  viewingNotice: Notice | null = null;
  revenueMonthLabel: string = this.getPreviousMonthYear(); // Set it dynamically

  
  getPreviousMonthYear(): string {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    return `${month} ${year}`;
  }
  
  cards: Card[] = [
  {
    subtitle: 'Add a Stadium',
    text: 'Start managing your venues by adding your stadium details',
    backgroundColor: '#F3A4A4',
    route: '/stadium-owner/add-stadium',
    statusClass: 'total'
  },
  {
    subtitle: 'Set up Player Packages',
    text: 'Create packages or pricing for players',
    backgroundColor: '#C0C0DE',
    route: '/stadium-owner/player-packages',
    statusClass: 'resolved'
  },
  {
    subtitle: 'Review Complaints',
    text: 'Track and resolve complaints for better management.',
    backgroundColor: '#CFEDC6',
    route: '/stadium-owner/maintenance-requests',
    statusClass: 'pending'
  },
  {
    subtitle: 'Waitlist System',
    text: 'Notify players the moment a slot opens.',
    backgroundColor: '#F9C8F1',
    route: '/stadium-owner/waitlist',
    statusClass: 'in_progress'
  }
];

  notices: Notice[] = [];

  // New properties for revenue chart
  revenueData: any = null;
  chart: any;

  constructor(
    private announcementService: StadiumOwnerAnnouncementService,
    private router: Router
  ) {}

  ngOnInit() {
     this.setPreviousMonthLabel();
    this.fetchNotices();
    this.fetchRevenueData(); // New method to fetch revenue
  }

  setPreviousMonthLabel() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[lastMonth.getMonth()];
    const year = lastMonth.getFullYear();

    this.revenueMonthLabel = `${monthName} ${year}`;
  }

  fetchNotices() {
    this.announcementService.getNotices().subscribe({
      next: (data) => {
        this.notices = data;
      },
      error: (error) => {
        console.error('Error fetching stadium owner announcements:', error);
      }
    });
  }

  openView(notice: Notice) {
    console.log('Opening modal for notice:', notice); // Debug
    this.viewingNotice = notice;
  }

  closeView() {
    this.viewingNotice = null;
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  formatDateTime(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }); // Format as MM/DD/YYYY, HH:MM AM/PM
  }

  navigateTo(route: string) {
    console.log('Navigating to:', route); // Debug
    this.router.navigate([route]);
  }

  trackByNoticeId(index: number, notice: Notice): number {
    return notice.id;
  }

  // New method to fetch revenue data
  fetchRevenueData() {
    this.announcementService.getRevenueData().subscribe({
      next: (data) => {
        this.revenueData = data;
        this.createChart(); // Create chart after data is fetched
      },
      error: (error) => {
        console.error('Error fetching revenue data:', error);
      }
    });
  }

  // New method to create the chart
  createChart() {
  if (this.chart) {
    this.chart.destroy(); // Destroy previous chart instance
  }

  const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
  if (ctx) {
    // Dynamically compute previous month
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    const monthName = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const chartLabel = `${monthName} ${year}`;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.revenueData.map((item: any) => item.stadium_name),
        datasets: [{
          label: chartLabel,
          data: this.revenueData.map((item: any) => item.total_revenue),
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336'],
          borderColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Revenue (Rs)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Stadium Name'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }
}

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy(); // Clean up chart on component destroy
    }
  }
}