import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

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

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.playerId = this.authService.getPlayerId();
    if (this.playerId) {
      this.fetchTimetable();
    } else {
      this.errorMessage = 'Please log in as a player to view your timetable';
    }
  }

  fetchTimetable(): void {
    if (!this.playerId) return;
    this.http.get(`http://localhost:5000/api/timetable/player/${this.playerId}`)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.sessions = response.sessions;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Failed to load timetable';
          }
        },
        error: (error) => {
          console.error('Error fetching timetable:', error);
          this.errorMessage = 'Error fetching timetable: ' + error.message;
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
}