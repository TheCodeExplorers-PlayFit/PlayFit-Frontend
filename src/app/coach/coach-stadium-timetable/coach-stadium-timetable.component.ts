import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking/booking.service';

@Component({
  selector: 'app-coach-stadium-timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coach-stadium-timetable.component.html',
  styleUrls: ['./coach-stadium-timetable.component.css']
})
export class CoachStadiumtimetableComponent implements OnInit {
  stadiumId: number | null = null;
  timetable: any[] = [];
  loading: boolean = true;
  error: string | null = null;

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
    this.bookingService.getWeeklyTimetable(this.stadiumId!).subscribe({
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

  bookSession(sessionId: number): void {
    this.bookingService.bookSession(sessionId).subscribe({
      next: (response) => {
        console.log('Session booked successfully:', response);
        this.loadTimetable();
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to book session';
      }
    });
  }
}