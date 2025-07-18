import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService, SalaryOverview, SessionsOverview } from '../../services/dashboard/dashboard.service';
import { Chart, registerables } from 'chart.js';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  salaryChart: Chart | undefined;
  sessionsChart: Chart | undefined;

  constructor(
  private dashboardService: DashboardService,
  private router: Router
) {
  Chart.register(...registerables);
}

  ngOnInit(): void {
    this.loadSalaryChart();
    this.loadSessionsChart();
  }

  loadSalaryChart(): void {
    this.dashboardService.getSalaryOverview().subscribe((data: SalaryOverview[]) => {
      const labels = data.map(d => d.day); // ✅ Use weekday names like 'Monday'
      const salaries = data.map(d => d.salary);

      if (this.salaryChart) {
        this.salaryChart.destroy();
      }

      this.salaryChart = new Chart('salaryChart', {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Weekly Salary',
              data: salaries,
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  }

   navigateToBookSession(): void {
    this.router.navigate(['coach/stadium-list']);
  }

  navigateToSchedule(): void {
  this.router.navigate(['coach/booking-history']);
}

navigateToSessionDetails(): void {
  this.router.navigate(['coach/view-session-details']);
}

navigateToReviewRatings(): void {
  this.router.navigate(['coach/View ratings']);
}


  loadSessionsChart(): void {
    this.dashboardService.getSessionsOverview().subscribe((data: SessionsOverview[]) => {
      const labels = data.map(d => d.month);
      const sessions = data.map(d => d.sessionsCount);

      if (this.sessionsChart) {
        this.sessionsChart.destroy();
      }

      this.sessionsChart = new Chart('sessionsChart', {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Sessions',
              data: sessions,
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  }
}
