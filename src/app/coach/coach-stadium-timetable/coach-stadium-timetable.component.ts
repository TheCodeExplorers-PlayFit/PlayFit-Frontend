import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking/booking.service';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth/auth.service';
import { debounce } from 'rxjs/operators';
import { interval } from 'rxjs';

@Component({
  selector: 'app-coach-stadium-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coach-stadium-timetable.component.html',
  styleUrls: ['./coach-stadium-timetable.component.css']
})
export class CoachStadiumtimetableComponent implements OnInit {
  stadiumId: number | null = null;
  timetable: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  showPopup: boolean = false;
  selectedSessionId: number | null = null;
  coachCost: number | null = null;
  coachId: number | null = null; 
  isUpdating: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private authService: AuthService 

  ) {}

 ngOnInit(): void {
  const currentUser = this.authService.getUser(); //  Get logged-in user

  if (currentUser && currentUser.role === 'coach') {
    this.coachId = currentUser.id; //  Set correct coachId
    console.log('Logged-in Coach ID:', this.coachId);
  } else {
    this.error = 'Invalid or unauthorized user';
    return;
  }

  this.stadiumId = +this.route.snapshot.paramMap.get('id')!;
  if (this.stadiumId) {
    this.loadTimetable();
  } else {
    this.error = 'Invalid stadium ID';
    this.loading = false;
  }
}

  loadTimetable(): void {
    // Get today's date dynamically 
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate one week from today 
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);

    // Format dates as YYYY-MM-DD strings for the API
    const startDate = today.toISOString().split('T')[0]; 
    const endDate = oneWeekLater.toISOString().split('T')[0]; 

    // Calculate the day_of_week values for the date range
    const daysInRange: { date: Date, dayOfWeek: number }[] = [];
    let currentDate = new Date(today);
    while (currentDate <= oneWeekLater) {

    // Convert to match database: 1=Monday, ..., 7=Sunday
    const jsDay = currentDate.getDay();
    const dbDay = jsDay === 0 ? 7 : jsDay; // Convert Sunday (0) to 7, others stay the same
    daysInRange.push({ date: new Date(currentDate), dayOfWeek: dbDay });
    currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log('Days in range:', daysInRange.map(d => ({
      date: d.date.toISOString().split('T')[0],
      dayOfWeek: d.dayOfWeek,
      dayName: this.getDayName(d.dayOfWeek)
    })));

    this.bookingService.getWeeklyTimetable(this.stadiumId!, startDate, endDate).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response.success && response.sessions) {
          // Filter sessions by stadium_id, isbooked, and day_of_week
          const validDays = daysInRange.map(day => day.dayOfWeek);
          this.timetable = response.sessions.filter((session: any) => {
            return session.stadium_id === this.stadiumId &&
                   session.isbooked === 0 &&
                   validDays.includes(session.day_of_week);
          }).map((session: any) => {
            // Map the session to include the actual date it occurs on within the range
            const matchingDay = daysInRange.find(day => day.dayOfWeek === session.day_of_week);
            return {
              ...session,
              displayDate: matchingDay ? matchingDay.date.toISOString().split('T')[0] : null
            };
          });

          console.log('Filtered Timetable:', this.timetable);
          if (this.timetable.length === 0) {
            this.error = 'No unassigned sessions available for this stadium from today onwards.';
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

  getDayName(dayOfWeek: number): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayOfWeek - 1];
  }

  openPopup(sessionId: number): void {
    this.selectedSessionId = sessionId;
    this.showPopup = true;
    this.coachCost = null;
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedSessionId = null;
    this.coachCost = null;
    this.isUpdating = false;
  }

  CoachCost(): void {
    console.log(`Calling updateCoachCost for sessionId: ${this.selectedSessionId}, coachCost: ${this.coachCost}`);

    if (this.isUpdating) {
      console.log('Update already in progress, skipping...');
      return;
    }

    if (this.selectedSessionId && this.coachCost !== null && this.coachCost >= 0) {
      this.isUpdating = true;
      this.bookingService.CoachCost(this.selectedSessionId, this.coachCost).subscribe({
        next: (response: any) => {
          console.log('Coach cost updated:', response);
          this.isUpdating = false;
        },
        error: (error: any) => {
          console.error('Error updating coach cost:', error);
          this.error = error.error?.message || 'Failed to update coach cost. Please ensure the stadium supports this sport.';
          this.closePopup();
        }
      });
    } else {
      this.error = 'Please enter a valid coach cost';
      this.isUpdating = false;
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