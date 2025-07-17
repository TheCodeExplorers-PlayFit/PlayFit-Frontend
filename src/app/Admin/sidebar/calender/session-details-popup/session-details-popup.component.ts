// frontend/src/app/components/calendar/session-details-popup/session-details-popup.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-session-details-popup',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './session-details-popup.component.html',
  styleUrls: ['./session-details-popup.component.css'],
})
export class SessionDetailsPopupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { session: any; stadium: any },
    private dialogRef: MatDialogRef<SessionDetailsPopupComponent>
  ) {}

  // Convert day_of_week (1-7) to day name
  getDayOfWeek(dayOfWeek: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || 'Unknown';
  }

  close() {
    this.dialogRef.close();
  }
}