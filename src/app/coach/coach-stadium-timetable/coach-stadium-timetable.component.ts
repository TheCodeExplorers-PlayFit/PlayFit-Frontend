import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking/booking.service';
import { AuthService } from '../../services/auth/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-coach-stadium-timetable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coach-stadium-timetable.component.html',
  styleUrls: ['./coach-stadium-timetable.component.css'],
})
export class CoachStadiumtimetableComponent implements OnInit {
  stadiumId: number | null = null;
  timetable: any[] = [];
  bookedSessions: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  showPopup: boolean = false;
  selectedSessionId: number | null = null;
  coachCost: number | null = null;
  coachId: number | null = null;
  isUpdating: boolean = false;
  cancellationWindows: { [sessionId: number]: { showButton: boolean; subscription: Subscription } } = {};

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.role === 'coach') {
      this.coachId = currentUser.id;
      console.log('Logged-in Coach ID:', this.coachId);
    } else {
      this.error = 'Invalid or unauthorized user';
      this.loading = false;
      return;
    }

    this.stadiumId = +this.route.snapshot.paramMap.get('id')!;
    if (this.stadiumId) {
      this.loadTimetable();
      this.loadBookedSessions();
    } else {
      this.error = 'Invalid stadium ID';
      this.loading = false;
    }
  }

  loadTimetable(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);
    const startDate = today.toISOString().split('T')[0];
    const endDate = oneWeekLater.toISOString().split('T')[0];

    const daysInRange: { date: Date; dayOfWeek: number }[] = [];
    let currentDate = new Date(today);
    while (currentDate <= oneWeekLater) {
      const jsDay = currentDate.getDay();
      const dbDay = jsDay === 0 ? 7 : jsDay;
      daysInRange.push({ date: new Date(currentDate), dayOfWeek: dbDay });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(
      'Days in range:',
      daysInRange.map((d) => ({
        date: d.date.toISOString().split('T')[0],
        dayOfWeek: d.dayOfWeek,
        dayName: this.getDayName(d.dayOfWeek),
      }))
    );

    this.bookingService.getWeeklyTimetable(this.stadiumId!, startDate, endDate).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response.success && response.sessions) {
          const validDays = daysInRange.map((day) => day.dayOfWeek);
          this.timetable = response.sessions
            .filter((session: any) => {
              return (
                session.stadium_id === this.stadiumId &&
                session.isbooked === 0 &&
                validDays.includes(session.day_of_week)
              );
            })
            .map((session: any) => {
              const matchingDay = daysInRange.find((day) => day.dayOfWeek === session.day_of_week);
              return {
                ...session,
                displayDate: matchingDay ? matchingDay.date.toISOString().split('T')[0] : null,
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
      },
    });
  }

  loadBookedSessions(): void {
    if (!this.coachId || !this.stadiumId) {
      this.error = 'Coach ID or Stadium ID missing';
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);
    const startDate = today.toISOString().split('T')[0];
    const endDate = oneWeekLater.toISOString().split('T')[0];

    this.bookingService.getCoachBookedSessions(this.stadiumId!, startDate, endDate).subscribe({
      next: (response:any) => {
        if (response.success && response.sessions) {
          this.bookedSessions = response.sessions.map((session: any) => ({
            ...session,
            displayDate: session.session_date,
            showCancelButton: false,
          }));
          console.log('Booked Sessions:', this.bookedSessions);
        } else {
          this.bookedSessions = [];
        }
      },
      error: (error:any) => {
        console.error('Error loading booked sessions:', error);
        this.error = error.error?.message || 'Failed to load booked sessions';
      },
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
        },
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
                const bookedSession = this.timetable.find((s) => s.id === this.selectedSessionId) || {
                  id: this.selectedSessionId,
                  session_date: new Date().toISOString().split('T')[0],
                  sport_name: 'Unknown',
                  start_time: '00:00:00',
                  end_time: '00:00:00',
                  status: 'booked',
                  isbooked: 1,
                  coach_id: this.coachId,
                };
                this.bookedSessions.push({
                  ...bookedSession,
                  displayDate: bookedSession.session_date,
                  showCancelButton: true,
                });
                this.timetable = this.timetable.filter((session) => session.id !== this.selectedSessionId);
                this.startCancellationTimer(this.selectedSessionId!);
                this.closePopup();
                this.loadTimetable();
                this.loadBookedSessions();
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
            },
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
      },
    });
  }

  startCancellationTimer(sessionId: number): void {
    console.log(`Starting cancellation timer for session ${sessionId}`);
    if (this.cancellationWindows[sessionId]) {
      this.cancellationWindows[sessionId].subscription.unsubscribe();
    }

    this.cancellationWindows[sessionId] = {
      showButton: true,
      subscription: interval(30000).subscribe(() => {
        console.log(`Hiding cancel button for session ${sessionId}`);
        this.cancellationWindows[sessionId].showButton = false;
        this.bookedSessions = this.bookedSessions.map((session) =>
          session.id === sessionId ? { ...session, showCancelButton: false } : session
        );
        this.cancellationWindows[sessionId].subscription.unsubscribe();
        delete this.cancellationWindows[sessionId];
      }),
    };
  }

  cancelBooking(sessionId: number): void {
    if (this.isUpdating) {
      console.log('Cancellation in progress, skipping...');
      return;
    }

    this.isUpdating = true;
    this.bookingService.cancelBooking(sessionId).subscribe({
      next: (response:any) => {
        console.log('Session cancelled successfully:', response);
        if (response.success) {
          const cancelledSession = this.bookedSessions.find((s) => s.id === sessionId);
          this.bookedSessions = this.bookedSessions.filter((s) => s.id !== sessionId);
          if (cancelledSession) {
            this.timetable.push({
              ...cancelledSession,
              coach_id: null,
              isbooked: 0,
              status: 'available',
              showCancelButton: false,
            });
          }
          if (this.cancellationWindows[sessionId]) {
            this.cancellationWindows[sessionId].subscription.unsubscribe();
            delete this.cancellationWindows[sessionId];
          }
          this.loadTimetable();
          this.loadBookedSessions();
        } else {
          this.error = response.message || 'Failed to cancel session';
        }
        this.isUpdating = false;
      },
      error: (error:any) => {
        console.error('Error cancelling session:', error);
        this.error = error.error?.message || 'Failed to cancel session';
        this.isUpdating = false;
      },
    });
  }
}