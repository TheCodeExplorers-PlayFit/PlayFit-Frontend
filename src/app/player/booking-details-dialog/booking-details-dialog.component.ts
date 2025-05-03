import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-details-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './booking-details-dialog.component.html',
  styleUrls: ['./booking-details-dialog.component.css']
})
export class BookingDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BookingDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      sportName: string;
      stadiumName: string;
      locationName: string;
      sessionDate: string;
      startTime: string;
      endTime: string;
      address: string;
      coachName: string;
      googleMapsLink: string;
    }
  ) {}

  navigateToStadium(): void {
    if (this.data.googleMapsLink) {
      window.open(this.data.googleMapsLink, '_blank');
    } else {
      alert('Google Maps link is not available for this stadium.');
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}