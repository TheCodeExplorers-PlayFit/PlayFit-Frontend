// waitlist.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

interface WaitlistEntry {
  waitlist_id: number;
  player_name: string;
  player_email: string;
  stadium_name: string;
  sport_name: string;
  start_time: string;
  end_time: string;
  day_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

@Component({
  selector: 'app-waitlist',
  standalone: true,
   templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.css'],
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
})
export class WaitlistComponent implements OnInit {
  private readonly apiUrl = 'http://localhost:5000/api';
  
  displayedColumns: string[] = [
    'waitlist_id', 
    'player_name', 
    'player_email', 
    'stadium_name', 
    'sport_name', 
    'session_time', 
    'day_name', 
    'status', 
    'created_at', 
    'action'
  ];
  
  waitlist: WaitlistEntry[] = [];
  loading = false;
  processingId: number | null = null;
  private ownerId: number | null = null;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  private initializeComponent(): void {
    const user = this.authService.getUser();
    
    if (!user || user.role !== 'stadiumOwner') {
      this.showError('You must be logged in as a stadium owner to access this page.');
      return;
    }
    
    this.ownerId = user.id;
    this.loadWaitlist();
  }

  loadWaitlist(): void {
    if (!this.ownerId) {
      this.showError('Invalid user session. Please log in again.');
      return;
    }

    this.loading = true;
    const token = this.getAuthToken();

    this.http.get<{success: boolean; waitlist: WaitlistEntry[]}>(`${this.apiUrl}/waitlist`, {
      params: { ownerId: this.ownerId.toString() },
      headers: this.getAuthHeaders(token)
    }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.waitlist = response.waitlist || [];
          console.log('Loaded waitlist entries:', this.waitlist.length);
        } else {
          this.showError('Failed to load waitlist data.');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.handleError(error, 'Failed to load waitlist');
      }
    });
  }

  updateWaitlistStatus(waitlistId: number, status: 'approved' | 'rejected'): void {
    if (this.processingId) {
      return; // Prevent multiple simultaneous requests
    }

    this.processingId = waitlistId;
    const token = this.getAuthToken();

    this.http.post<{success: boolean; message: string}>(`${this.apiUrl}/waitlist/update-status`, {
      waitlistId,
      status
    }, {
      headers: this.getAuthHeaders(token)
    }).subscribe({
      next: (response) => {
        this.processingId = null;
        if (response.success) {
          this.showSuccess(`Waitlist entry ${status} successfully`);
          this.loadWaitlist(); // Reload to get updated data
        } else {
          this.showError(response.message || `Failed to ${status} waitlist entry`);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.processingId = null;
        this.handleError(error, `Failed to ${status} waitlist entry`);
      }
    });
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private getAuthHeaders(token: string | null): Record<string, string> {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private handleError(error: HttpErrorResponse, defaultMessage: string): void {
    console.error('API Error:', error);
    
    let message = defaultMessage;
    
    if (error.status === 401) {
      message = 'Session expired. Please log in again.';
      // You might want to redirect to login here
    } else if (error.status === 403) {
      message = 'Access denied. You do not have permission to perform this action.';
    } else if (error.status === 0) {
      message = 'Unable to connect to server. Please check your internet connection.';
    } else if (error.error?.message) {
      message = error.error.message;
    }
    
    this.showError(message);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}