import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking/booking.service';

@Component({
  selector: 'app-stadium-timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stadium-timetable.component.html',
  styleUrls: ['./stadium-timetable.component.css']
})
export class StadiumtimetableComponent implements OnInit {
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
        if (response.success && response.sessions) {
          this.timetable = response.sessions;
        } else {
          this.error = response.message || 'No timetable data available';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load timetable';
        this.loading = false;
      }
    });
  }

  bookSession(sessionId: number): void {
    this.bookingService.bookSession(sessionId).subscribe({
      next: (response) => {
        console.log('Session booked successfully:', response);
        // Optionally navigate to a confirmation page
        // this.router.navigate(['/booking-confirmation', sessionId]);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to book session';
      }
    });
  }
}