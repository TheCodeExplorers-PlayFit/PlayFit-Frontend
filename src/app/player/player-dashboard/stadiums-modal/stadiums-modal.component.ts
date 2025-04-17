import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stadiums-modal',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './stadiums-modal.component.html',
  styleUrls: ['./stadiums-modal.component.css']
})
export class StadiumsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<StadiumsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stadiums: any[], sportId: number, locationId: number }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}