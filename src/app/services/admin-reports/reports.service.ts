// services/admin-reports/reports.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:5000/api/admin-reports';
  private http = inject(HttpClient);

  // Monthly Financial Reports
  getMonthlyFinancialReport(year: number, month: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/financial?year=${year}&month=${month}`);
  }

  getFinancialReportRange(startYear: number, startMonth: number, endYear: number, endMonth: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/financial-range?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}`);
  }

  // Monthly Health & Safety Reports
  getMonthlyHealthReport(year: number, month: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/health?year=${year}&month=${month}`);
  }

  getHealthReportRange(startYear: number, startMonth: number, endYear: number, endMonth: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/health-range?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}`);
  }

  // Monthly Operations Reports
  getMonthlyOperationsReport(year: number, month: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/operations?year=${year}&month=${month}`);
  }

  getOperationsReportRange(startYear: number, startMonth: number, endYear: number, endMonth: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/operations-range?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}`);
  }

  // Monthly Content & Engagement Reports
  getMonthlyContentReport(year: number, month: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/content?year=${year}&month=${month}`);
  }

  getContentReportRange(startYear: number, startMonth: number, endYear: number, endMonth: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/content-range?startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}`);
  }

  // Export Reports
  exportFinancialReport(year: number, month: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/financial?year=${year}&month=${month}`, { 
      responseType: 'blob' 
    });
  }

  exportHealthReport(year: number, month: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/health?year=${year}&month=${month}`, { 
      responseType: 'blob' 
    });
  }

  exportOperationsReport(year: number, month: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/operations?year=${year}&month=${month}`, { 
      responseType: 'blob' 
    });
  }

  exportContentReport(year: number, month: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/content?year=${year}&month=${month}`, { 
      responseType: 'blob' 
    });
  }

  // Get available months with data
  getAvailableMonths(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-months`);
  }

  // Generate comprehensive monthly report
  generateComprehensiveReport(year: number, month: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/comprehensive?year=${year}&month=${month}`, { 
      responseType: 'blob' 
    });
  }
}