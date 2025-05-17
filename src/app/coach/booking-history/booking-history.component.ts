import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service'; // Adjust path if needed

@Component({
  selector: 'app-booking-history',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  coachId: number | null = null;
  private apiUrl: string = 'http://localhost:5000/api/coach-sessions';
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    console.log('User data from AuthService:', user); // Debug log
    if (user && user.role === 'coach') {
      this.coachId = user.id;
      console.log('Coach ID retrieved:', this.coachId); // Debug log
      this.fetchBookingHistory();
    } else {
      this.error = 'Please log in as a coach to view booking history.';
      this.loading = false;
    }
  }

  fetchBookingHistory(): void {
    if (!this.coachId) {
      this.error = 'Coach ID not available';
      this.loading = false;
      return;
    }
    this.loading = true;
    this.error = null;
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token); // Debug log
    if (!token) {
      this.error = 'Authentication token not found. Please log in again.';
      this.loading = false;
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.apiUrl}/bookings`;
    console.log('Fetching booking history from:', url);
    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        console.log('Booking history response:', response);
        if (response.success && response.bookings) {
          this.bookings = response.bookings;
        } else {
          this.error = response.message || 'No bookings found';
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching booking history:', error);
        console.log('Error response details:', {
          status: error.status,
          message: error.error?.message || error.message,
          error: error.error
        }); // Detailed error logging
        if (error.status === 500) {
          this.error = 'An unexpected server error occurred while fetching booking history. Please try again later or contact support.';
        } else {
          this.error = error.error?.message || 'Failed to fetch booking history. Please check the server logs or network connection.';
        }
        this.loading = false;
      }
    });
  }

  viewBooking(booking: any): void {
    console.log('View booking:', booking);
  }
}