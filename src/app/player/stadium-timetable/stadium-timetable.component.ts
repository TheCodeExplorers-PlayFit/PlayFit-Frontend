import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stadium-timetable',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './stadium-timetable.component.html',
  styleUrls: ['./stadium-timetable.component.css']
})
export class StadiumTimetableComponent implements OnInit {
  private apiUrl = 'http://localhost:5000/api';
  displayedColumns: string[] = ['date', 'sport', 'startTime', 'endTime', 'status', 'action'];
  sessions: any[] = [];
  stadiumId: number | null = null;
  sportId: number | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.stadiumId = Number(params.get('stadiumId'));
      this.route.queryParamMap.subscribe(queryParams => {
        this.sportId = queryParams.get('sportId') ? Number(queryParams.get('sportId')) : null;
        this.loadTimetable();
      });
    });
  }

  loadTimetable(): void {
    if (this.stadiumId) {
      this.http.get(`${this.apiUrl}/sessions/timetable`, {
        params: { stadiumId: this.stadiumId.toString() }
      }).subscribe({
        next: (response: any) => {
          this.sessions = response.sessions || [];
        },
        error: (error) => {
          console.error('Error fetching timetable:', error);
          this.snackBar.open('Failed to load timetable. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  bookSession(sessionId: number): void {
    // Placeholder for booking logic
    this.snackBar.open(`Booking session ${sessionId}... (Not implemented)`, 'Close', { duration: 3000 });
  }
}