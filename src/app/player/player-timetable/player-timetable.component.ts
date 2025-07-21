// player-timetable.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-player-timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-timetable.component.html',
  styleUrl: './player-timetable.component.css'
})
export class PlayerTimetableComponent implements OnInit {
  sessions: any[] = [];
  selectedSession: any = null;
  showModal: boolean = false;
  errorMessage: string = '';
  playerId: number | null = null;
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.playerId = this.authService.getPlayerId();
    if (this.playerId) {
      this.fetchTimetable();
    } else {
      this.errorMessage = 'Please log in as a player to view your timetable';
      this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
    }
  }

  fetchTimetable(): void {
    if (!this.playerId) return;
    this.http.get(`${this.apiUrl}/timetable/player/${this.playerId}`)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.sessions = response.sessions;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Failed to load timetable';
            this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Error fetching timetable:', error);
          this.errorMessage = 'Error fetching timetable: ' + error.message;
          this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
        }
      });
  }

  openSessionModal(session: any): void {
    this.selectedSession = session;
    this.showModal = true;
  }

  closeSessionModal(): void {
    this.showModal = false;
    this.selectedSession = null;
  }

  navigateToStadium(googleMapsLink: string): void {
    if (googleMapsLink) {
      window.open(googleMapsLink, '_blank');
    }
  }

  cancelBooking(): void {
    if (!this.playerId || !this.selectedSession) {
      this.snackBar.open('Invalid booking or player information', 'Close', { duration: 3000 });
      return;
    }

    if (confirm('Are you sure you want to cancel this booking? You will need to contact the stadium owner for refund processing.')) {
      this.http.post(`${this.apiUrl}/refunded/request-refunded`, {
        bookingId: this.selectedSession.booking_id,
        playerId: this.playerId
      }).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.snackBar.open(response.message, 'Close', { duration: 5000 });
            this.closeSessionModal();
            this.fetchTimetable(); // Refresh the timetable
          } else {
            this.snackBar.open(response.message || 'Failed to cancel booking', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Error cancelling booking:', error);
          this.snackBar.open('Failed to cancel booking. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}