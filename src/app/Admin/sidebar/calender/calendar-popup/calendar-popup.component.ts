// frontend/src/app/components/calendar/calendar-popup.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SessionDetailsPopupComponent } from '../session-details-popup/session-details-popup.component';

@Component({
  selector: 'app-calendar-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './calendar-popup.component.html',
  styleUrls: ['./calendar-popup.component.css'],
})
export class CalendarPopupComponent implements OnInit {
  private baseUrl = 'http://localhost:5000/api/calendar';
  searchControl = new FormControl('');
  stadiums: any[] = [];
  selectedStadium: any = null;
  sessions: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { date: string },
    private dialogRef: MatDialogRef<CalendarPopupComponent>,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((search) => {
        this.searchStadiums(search || '');
      });
    this.searchStadiums('');
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  searchStadiums(search: string) {
    this.loading = true;
    this.stadiums = [];
    this.http
      .get(`${this.baseUrl}/stadiums?search=${search}`, { headers: this.getHeaders() })
      .subscribe({
        next: (response: any) => {
          this.stadiums = response.data;
          this.loading = false;
          console.log('Stadiums loaded:', JSON.stringify(this.stadiums, null, 2));
        },
        error: (err) => {
          this.error = 'Failed to load stadiums';
          this.loading = false;
          console.error('Stadium search error:', err);
        },
      });
  }

  selectStadium(stadium: any) {
    this.selectedStadium = stadium;
    this.sessions = [];
    this.loading = true;
    this.error = null;
    this.http
      .get(`${this.baseUrl}/sessions/${stadium.id}/${this.data.date}`, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: (response: any) => {
          this.sessions = response.data.map((session: any) => ({
            ...session,
            start_time: this.parseTime(session.start_time),
            end_time: this.parseTime(session.end_time),
          }));
          this.loading = false;
          console.log('Sessions loaded:', JSON.stringify(this.sessions, null, 2));
        },
        error: (err) => {
          this.error = 'Failed to load sessions';
          this.loading = false;
          console.error('Session fetch error:', err);
        },
      });
  }

  private parseTime(timeStr: string): Date {
    if (!timeStr) return new Date();
    const [hours, minutes] = timeStr.split(':');
    const now = new Date();
    return new Date(now.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0));
  }

  selectSession(session: any) {
    console.log('Opening session details for:', session);
    this.dialog.open(SessionDetailsPopupComponent, {
      data: { session, stadium: this.selectedStadium },
      width: '600px',
    });
  }

  getDayOfWeek(dayOfWeek: number): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayOfWeek - 1] || 'Unknown';
  }

  close() {
    this.dialogRef.close();
  }
}