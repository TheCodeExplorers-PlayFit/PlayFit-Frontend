import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-ratings-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './ratings-popup.component.html',
  styleUrls: ['./ratings-popup.component.css']
})
export class RatingsPopupComponent {
  rating: number = 1;
  comment: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<RatingsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { entityId: number; entityName: string }
  ) {}

  submitRating(): void {
    if (!this.rating || this.rating < 1 || this.rating > 5) {
      this.errorMessage = 'Please select a valid rating (1-5).';
      return;
    }

    const token = localStorage.getItem('token'); // Adjust key if different
    if (!token) {
      this.errorMessage = 'You must be logged in to submit a rating.';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      entity_id: this.data.entityId,
      rating: this.rating,
      comment: this.comment.trim() || null
    };

    this.http
      .post<{ success: boolean; message: string }>(
        'http://localhost:5000/api/coach-sessions/rate',
        payload,
        { headers }
      )
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.dialogRef.close(true);
          } else {
            this.errorMessage = res.message || 'Failed to submit rating.';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to submit rating. Please try again.';
        }
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}