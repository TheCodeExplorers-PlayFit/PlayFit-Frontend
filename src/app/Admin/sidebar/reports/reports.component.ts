import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Interfaces
export interface MonthlyFinancialReport {
  month: string;
  month_name: string;
  total_revenue: number;
  total_transactions: number;
  unique_players: number;
  avg_transaction_value: number;
  popular_session_type: string;
  growth_rate: number;
}

export interface MonthlyHealthReport {
  month: string;
  month_name: string;
  total_injuries: number;
  total_appointments: number;
  minor_injuries: number;
  moderate_injuries: number;
  severe_injuries: number;
  most_common_injury: string;
  first_aid_rate: number;
  health_officer_utilization: number;
}

export interface MonthlyOperationsReport {
  month: string;
  month_name: string;
  total_bookings: number;
  active_players: number;
  active_coaches: number;
  stadium_utilization: number;
  total_sessions: number;
  avg_rating: number;
  new_registrations: number;
  completion_rate: number;
}

export interface MonthlyContentReport {
  month: string;
  month_name: string;
  blogs_published: number;
  verified_blogs: number;
  announcements_posted: number;
  total_ratings_given: number;
  avg_content_rating: number;
  most_active_author: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  
  // Inject HttpClient directly
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/admin-reports';

  // Current selection
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;
  selectedReportType: string = 'financial';
  
  // Data properties
  financialReports: MonthlyFinancialReport[] = [];
  healthReports: MonthlyHealthReport[] = [];
  operationsReports: MonthlyOperationsReport[] = [];
  contentReports: MonthlyContentReport[] = [];
  
  // UI properties
  loading = false;
  availableMonths: any[] = [];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Range selection for comparison
  showRangeSelector = false;
  startYear: number = new Date().getFullYear();
  startMonth: number = 1;
  endYear: number = new Date().getFullYear();
  endMonth: number = new Date().getMonth() + 1;

  ngOnInit(): void {
    this.loadAvailableMonths();
    this.loadCurrentMonthReports();
  }

  loadAvailableMonths(): void {
    this.http.get<any>(`${this.apiUrl}/available-months`).subscribe({
      next: (response) => {
        if (response.success) {
          this.availableMonths = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading available months:', error);
      }
    });
  }

  loadCurrentMonthReports(): void {
    this.loadReportByType();
  }

  onReportTypeChange(): void {
    this.loadReportByType();
  }

  onMonthYearChange(): void {
    this.loadReportByType();
  }

  loadReportByType(): void {
    this.loading = true;
    
    switch (this.selectedReportType) {
      case 'financial':
        this.loadFinancialReport();
        break;
      case 'health':
        this.loadHealthReport();
        break;
      case 'operations':
        this.loadOperationsReport();
        break;
      case 'content':
        this.loadContentReport();
        break;
    }
  }

  loadFinancialReport(): void {
    if (this.showRangeSelector) {
      const url = `${this.apiUrl}/financial-range?startYear=${this.startYear}&startMonth=${this.startMonth}&endYear=${this.endYear}&endMonth=${this.endMonth}`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.financialReports = response.success ? response.data : [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading financial report:', error);
          this.financialReports = [];
          this.loading = false;
        }
      });
    } else {
      const url = `${this.apiUrl}/financial?year=${this.selectedYear}&month=${this.selectedMonth}`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.financialReports = response.success ? [response.data] : [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading financial report:', error);
          this.financialReports = [];
          this.loading = false;
        }
      });
    }
  }

  loadHealthReport(): void {
    if (this.showRangeSelector) {
      const url = `${this.apiUrl}/health-range?startYear=${this.startYear}&startMonth=${this.startMonth}&endYear=${this.endYear}&endMonth=${this.endMonth}`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.healthReports = response.success ? response.data : [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading health report:', error);
          this.healthReports = [];
          this.loading = false;
        }
      });
    } else {
      const url = `${this.apiUrl}/health?year=${this.selectedYear}&month=${this.selectedMonth}`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.healthReports = response.success ? [response.data] : [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading health report:', error);
          this.healthReports = [];
          this.loading = false;
        }
      });
    }
  }

  loadOperationsReport(): void {
    if (this.showRangeSelector) {
      const url = `${this.apiUrl}/operations-range?startYear=${this.startYear}&startMonth=${this.startMonth}&endYear=${this.endYear}&endMonth=${this.endMonth}`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.operationsReports = response.success ? response.data : [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading operations report:', error);
          this.operationsReports = [];
          this.loading = false;
        }
      });
    } else {
      const url = `${this.apiUrl}/operations?year=${this.selectedYear}&month=${this.selectedMonth}`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.operationsReports = response.success ? [response.data] : [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading operations report:', error);
          this.operationsReports = [];
          this.loading = false;
        }
      });
    }
  }

  loadContentReport(): void {
    if (this.showRangeSelector) {
      const url = `${this.apiUrl}/content-range?startYear=${this.startYear}&startMonth=${this.startMonth}&endYear=${this.endYear}&endMonth=${this.endMonth}`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.contentReports = response.success ? response.data : [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading content report:', error);
          this.contentReports = [];
          this.loading = false;
        }
      });
    } else {
      const url = `${this.apiUrl}/content?year=${this.selectedYear}&month=${this.selectedMonth}`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.contentReports = response.success ? [response.data] : [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading content report:', error);
          this.contentReports = [];
          this.loading = false;
        }
      });
    }
  }

  toggleRangeSelector(): void {
    this.showRangeSelector = !this.showRangeSelector;
    if (!this.showRangeSelector) {
      this.loadReportByType();
    }
  }

  applyDateRange(): void {
    if (this.startYear && this.startMonth && this.endYear && this.endMonth) {
      this.loadReportByType();
    }
  }

  // Export functions
  exportCurrentReport(): void {
    const year = this.showRangeSelector ? this.startYear : this.selectedYear;
    const month = this.showRangeSelector ? this.startMonth : this.selectedMonth;
    
    const url = `${this.apiUrl}/export/${this.selectedReportType}?year=${year}&month=${month}`;
    
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `${this.selectedReportType}-report-${year}-${month}.csv`);
      },
      error: (error) => {
        console.error('Export error:', error);
        alert('Failed to export report. Please try again.');
      }
    });
  }

  exportComprehensiveReport(): void {
    const year = this.showRangeSelector ? this.startYear : this.selectedYear;
    const month = this.showRangeSelector ? this.startMonth : this.selectedMonth;
    
    const url = `${this.apiUrl}/comprehensive?year=${year}&month=${month}`;
    
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `comprehensive-report-${year}-${month}.csv`);
      },
      error: (error) => {
        console.error('Comprehensive export error:', error);
        alert('Failed to export comprehensive report. Please try again.');
      }
    });
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Utility functions
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  }

  formatPercent(value: number): string {
    return `${(value || 0).toFixed(1)}%`;
  }

  getMonthName(monthNumber: number): string {
    return this.monthNames[monthNumber - 1] || '';
  }

  getReportTitle(): string {
    const monthName = this.getMonthName(this.selectedMonth);
    const typeTitle = this.selectedReportType.charAt(0).toUpperCase() + this.selectedReportType.slice(1);
    
    if (this.showRangeSelector) {
      const startMonthName = this.getMonthName(this.startMonth);
      const endMonthName = this.getMonthName(this.endMonth);
      return `${typeTitle} Reports: ${startMonthName} ${this.startYear} - ${endMonthName} ${this.endYear}`;
    }
    
    return `${typeTitle} Report: ${monthName} ${this.selectedYear}`;
  }

  hasData(): boolean {
    switch (this.selectedReportType) {
      case 'financial':
        return this.financialReports.length > 0;
      case 'health':
        return this.healthReports.length > 0;
      case 'operations':
        return this.operationsReports.length > 0;
      case 'content':
        return this.contentReports.length > 0;
      default:
        return false;
    }
  }

  refreshData(): void {
    this.loadReportByType();
  }
}