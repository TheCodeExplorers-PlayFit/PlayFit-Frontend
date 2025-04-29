import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { BookingConfirmationDialogComponent } from '../booking-confirmation-dialog/booking-confirmation-dialog.component';

interface Payhere {
  onCompleted: (paymentId: string) => void;
  onDismissed: () => void;
  onError: (error: string) => void;
  startPayment: (payment: any) => void;
}

declare global {
  interface Window {
    payhere: Payhere;
  }
}

@Component({
  selector: 'app-stadium-timetable',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    BookingConfirmationDialogComponent
  ],
  providers: [CurrencyPipe],
  templateUrl: './stadium-timetable.component.html',
  styleUrls: ['./stadium-timetable.component.css']
})
export class StadiumTimetableComponent implements OnInit {
  private apiUrl = 'http://localhost:5000/api';
  displayedColumns: string[] = ['date', 'sport', 'startTime', 'endTime', 'status', 'totalCost', 'action'];
  sessions: any[] = [];
  stadiumId: number | null = null;
  sportId: number | null = null;
  playerId: number = 18;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.stadiumId = Number(params.get('stadiumId'));
      this.route.queryParamMap.subscribe(queryParams => {
        this.sportId = queryParams.get('sportId') ? Number(queryParams.get('sportId')) : null;
        this.loadTimetable();
      });
    });
  }

  loadTimetable(): void {
    if (this.stadiumId) {
      this.http.get(`${this.apiUrl}/sessions/timetable`, {
        params: { stadiumId: this.stadiumId.toString() }
      }).subscribe({
        next: (response: any) => {
          this.sessions = response.sessions || [];
        },
        error: (error) => {
          console.error('Error fetching timetable:', error);
          this.snackBar.open('Failed to load timetable. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  bookSession(sessionId: number): void {
    this.http.get(`${this.apiUrl}/sessions/validate-session`, {
      params: { sessionId: sessionId.toString() }
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          const dialogRef = this.dialog.open(BookingConfirmationDialogComponent, {
            width: '400px',
            data: { totalCost: response.session.total_cost }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.initiatePayment(sessionId);
            } else {
              this.snackBar.open('Booking cancelled', 'Close', { duration: 3000 });
            }
          });
        } else {
          this.snackBar.open('Session is unavailable', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Error validating session:', error);
        this.snackBar.open('Failed to validate session. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  initiatePayment(sessionId: number): void {
    this.http.post(`${this.apiUrl}/sessions/initiate-payment`, {
      sessionId,
      playerId: this.playerId
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          const checkPayHere = (callback: () => void, timeout = 5000) => {
            console.log('Checking PayHere SDK availability...');
            const startTime = Date.now();
            const interval = setInterval(() => {
              console.log('PayHere status:', !!window.payhere);
              if (window.payhere) {
                clearInterval(interval);
                callback();
              } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                console.error('PayHere SDK not loaded within timeout');
                this.snackBar.open('Payment service unavailable. Please try again later.', 'Close', { duration: 3000 });
              }
            }, 100);
          };

          checkPayHere(() => {
            window.payhere.onCompleted = (paymentId: string) => {
              this.snackBar.open(`Payment completed: ${paymentId}`, 'Close', { duration: 3000 });
              this.loadTimetable();
            };
            window.payhere.onDismissed = () => {
              this.snackBar.open('Payment cancelled', 'Close', { duration: 3000 });
            };
            window.payhere.onError = (error: string) => {
              this.snackBar.open(`Payment failed: ${error}`, 'Close', { duration: 3000 });
            };
            window.payhere.startPayment(response.payment);
          });
        } else {
          this.snackBar.open('Failed to initiate payment', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Error initiating payment:', error);
        this.snackBar.open('Failed to initiate payment. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}