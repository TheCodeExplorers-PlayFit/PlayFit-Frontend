import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ratings-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './ratings-popup.component.html',
  styleUrls: ['./ratings-popup.component.css']
})
export class RatingsPopupComponent {
  private baseUrl = 'http://localhost:5000/api/ratings';
  ratings: any[] = [];
  newRating: number = 0;
  newComment: string = '';

  constructor(
    public dialogRef: MatDialogRef<RatingsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { entityType: string, entityId: number, entityName: string },
    private http: HttpClient
  ) {
    this.loadRatings();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadRatings(): void {
    console.log('Loading ratings for:', this.data.entityType, this.data.entityId); // Debug
    this.http.get(`${this.baseUrl}/${this.data.entityType}/${this.data.entityId}`, { headers: this.getHeaders() })
      .subscribe({
        next: (response: any) => {
          console.log('Ratings response:', response); // Debug
          this.ratings = response.data || [];
        },
        error: (error) => {
          console.error('Error loading ratings:', error);
          this.ratings = [];
        }
      });
  }

  submitRating(): void {
    if (this.newRating < 1 || this.newRating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }
    this.http.post(this.baseUrl, {
      entityType: this.data.entityType,
      entityId: this.data.entityId,
      rating: this.newRating,
      comment: this.newComment
    }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.loadRatings();
        this.newRating = 0;
        this.newComment = '';
      },
      error: (error) => {
        console.error('Error submitting rating:', error);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}