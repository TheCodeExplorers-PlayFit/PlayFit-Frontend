// frontend/src/app/components/calendar/calender.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CalendarPopupComponent } from './calendar-popup/calendar-popup.component';
import { SessionDetailsPopupComponent } from './session-details-popup/session-details-popup.component';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    RouterModule,
    CalendarPopupComponent,
    SessionDetailsPopupComponent // Added new component
  ],
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})
export class CalendarComponent implements OnInit {
  private baseUrl = 'http://localhost:5000/api/calendar';
  currentDate: Date = new Date();
  daysInMonth: number[] = [];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user || user.role !== 'admin') {
      this.router.navigate(['/']);
      return;
    }
    this.generateCalendar();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array(daysInMonth)
      .fill(0)
      .map((_, i) => i + 1);
    // Add padding for the first day
    for (let i = 0; i < firstDay; i++) {
      this.daysInMonth.unshift(0);
    }
  }

  onDateClick(day: number) {
    if (day === 0) return; // Ignore empty cells
    const date = `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    this.dialog.open(CalendarPopupComponent, {
      data: { date },
      width: '800px',
    });
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }
}