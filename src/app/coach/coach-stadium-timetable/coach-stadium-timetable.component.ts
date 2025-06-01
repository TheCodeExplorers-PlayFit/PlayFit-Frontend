import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking/booking.service';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth/auth.service';
// Import FormsModule for ngModel
import { debounce } from 'rxjs/operators'; // Import debounce operator
import { interval } from 'rxjs'; // Import interval for debounce

@Component({
  selector: 'app-coach-stadium-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule to imports
  templateUrl: './coach-stadium-timetable.component.html',
  styleUrls: ['./coach-stadium-timetable.component.css']
})
export class CoachStadiumtimetableComponent implements OnInit {
  stadiumId: number | null = null;
  timetable: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  showPopup: boolean = false; // Flag to show/hide popup
  selectedSessionId: number | null = null; // Store the session ID being booked
  coachCost: number | null = null; // Store the coach cost input
  coachId: number | null = 50; // Updated to 50 for Coach 50 (replace with auth logic if needed)
  isUpdating: boolean = false; // Flag to prevent multiple updates

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.stadiumId = +this.route.snapshot.paramMap.get('id')!;
    if (this.stadiumId) {
      this.loadTimetable();
    } else {
      this.error = 'Invalid stadium ID';
      this.loading = false;
    }
  }

  loadTimetable(): void {
    // Define the date range: today (May 31, 2025) to one week from today (June 7, 2025)
    const today = new Date('2025-05-31');
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);

    // Format dates as YYYY-MM-DD strings for the API (adjust format as per backend requirement)
    const startDate = today.toISOString().split('T')[0]; // 2025-05-31
    const endDate = oneWeekLater.toISOString().split('T')[0]; // 2025-06-07

    this.bookingService.getWeeklyTimetable(this.stadiumId!, startDate, endDate).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response.success && response.sessions) {
          this.timetable = response.sessions.filter((session: any) => session.isbooked === 0);
          console.log('Filtered Timetable:', this.timetable);
          if (this.timetable.length === 0) {
            this.error = 'No unassigned sessions available for this stadium.';
          } else {
            this.error = null;
          }
        } else {
          this.error = response.message || 'No timetable data available';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('API Error:', error);
        this.error = error.error?.message || 'Failed to load timetable';
        this.loading = false;
      }
    });
  }

  openPopup(sessionId: number): void {
    this.selectedSessionId = sessionId;
    this.showPopup = true;
    this.coachCost = null; // Reset coach cost input
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedSessionId = null;
    this.coachCost = null;
    this.isUpdating = false; // Reset the flag
  }

  CoachCost(): void {
    console.log(`Calling updateCoachCost for sessionId: ${this.selectedSessionId}, coachCost: ${this.coachCost}`);

    if (this.isUpdating) {
      console.log('Update already in progress, skipping...');
      return; // Prevent multiple updates
    }

    if (this.selectedSessionId && this.coachCost !== null && this.coachCost >= 0) {
      this.isUpdating = true; // Set the flag to indicate an update is in progress
      this.bookingService.CoachCost(this.selectedSessionId, this.coachCost).subscribe({
        next: (response: any) => {
          console.log('Coach cost updated:', response);
          this.isUpdating = false; // Reset the flag
        },
        error: (error: any) => {
          console.error('Error updating coach cost:', error);
          this.error = error.error?.message || 'Failed to update coach cost. Please ensure the stadium supports this sport.';
          this.closePopup();
        }
      });
    } else {
      this.error = 'Please enter a valid coach cost';
      this.isUpdating = false; // Reset the flag
    }
  }

confirmBooking(): void {
  if (this.isUpdating) {
    console.log('Update in progress, skipping...');
    return;
  }

  if (!this.selectedSessionId || this.coachCost === null || this.coachCost < 0) {
    this.error = 'Please enter a valid session ID and coach cost';
    this.closePopup();
    return;
  }

  if (!this.coachId) {
    this.error = 'Coach ID not found. Please ensure you are logged in.';
    this.closePopup();
    return;
  }

  this.isUpdating = true;
  this.bookingService.CoachCost(this.selectedSessionId, this.coachCost).subscribe({
    next: (response) => {
      console.log('Coach cost updated:', response);
      if (response.success) {
        this.bookingService.bookSession(this.selectedSessionId!, this.coachId!).subscribe({
          next: (bookResponse) => {
            console.log('Session booked successfully:', bookResponse);
            if (bookResponse.success) {
              this.timetable = this.timetable.filter(session => session.id !== this.selectedSessionId);
              this.closePopup();
            } else {
              this.error = bookResponse.message || 'Failed to book session';
              this.closePopup();
            }
            this.isUpdating = false;
          },
          error: (error) => {
            console.error('Error booking session:', error);
            this.error = error.status === 404 ? 'Session not found or already booked' : (error.error?.message || 'Failed to book session');
            this.isUpdating = false;
            this.closePopup();
          }
        });
      } else {
        this.error = response.message || 'Failed to update coach cost';
        this.isUpdating = false;
        this.closePopup();
      }
    },
    error: (error) => {
      console.error('Error updating coach cost:', error);
      this.error = error.error?.message || 'Failed to update coach cost';
      this.isUpdating = false;
      this.closePopup();
    }
  });
}
}