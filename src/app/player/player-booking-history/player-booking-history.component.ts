import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-player-booking-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-booking-history.component.html',
  styleUrl: './player-booking-history.component.css'
})
export class PlayerBookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  selectedBooking: any = null;
  showModal: boolean = false;
  errorMessage: string = '';
  playerId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.playerId = this.authService.getPlayerId();
    if (this.playerId) {
      this.fetchBookings();
    } else {
      this.errorMessage = 'Please log in as a player to view booking history';
    }
  }

  fetchBookings(): void {
    if (!this.playerId) return;
    this.http.get(`http://localhost:5000/api/booking-history/player/${this.playerId}`)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.bookings = response.bookings;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Failed to load bookings';
          }
        },
        error: (error) => {
          console.error('Error fetching bookings:', error);
          this.errorMessage = 'Error fetching bookings: ' + error.message;
        }
      });
  }

  openBookingModal(booking: any): void {
    this.selectedBooking = booking;
    this.showModal = true;
  }

  closeBookingModal(): void {
    this.showModal = false;
    this.selectedBooking = null;
  }
}