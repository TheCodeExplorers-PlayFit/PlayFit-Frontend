import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// Update the import path below to match the actual location of session-detail.service.ts
import { SessionDetailService } from '../../services/session-detail/session-detail.service';

interface SessionDetails {
  sessionId: number;
  startTime: string;
  endTime: string;
  date: string;
  playerCount: number;
  players: string[];
}

interface ApiResponse {
  success: boolean;
  sessions: SessionDetails[];
  message?: string;
}

@Component({
  selector: 'app-session-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent {
  private http = inject(HttpClient);
  private sessionDetailService = inject(SessionDetailService);
  sessions: SessionDetails[] = [];
  error: string | null = null;

  ngOnInit() {
    this.loadSessionDetails();
  }

  loadSessionDetails() {
    const coachId = this.sessionDetailService.getCoachId();
    console.log('coachId:', coachId, 'Type:', typeof coachId); // Debug
    if (!coachId || isNaN(coachId)) {
      this.error = 'Invalid or missing coach ID. Please log in as a coach.';
      console.error('Invalid coachId:', coachId);
      return;
    }
    this.http.get<ApiResponse>(`http://localhost:5000/api/coach-sessions/details/${coachId}`)
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);
          this.sessions = response.success ? response.sessions : [];
          this.error = response.message || (!response.success ? 'Failed to load session details' : null);
        },
        error: (err) => {
          console.error('HTTP Error:', err); // Line ~53
          this.error = `Failed to load session details: ${err.status} - ${err.statusText} (${err.message})`;
        }
      });
  }
}