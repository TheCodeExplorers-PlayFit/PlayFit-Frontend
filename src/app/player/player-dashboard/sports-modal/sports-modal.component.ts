import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sports-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule],
  templateUrl: './sports-modal.component.html',
  styleUrls: ['./sports-modal.component.css']
})
export class SportsModalComponent {
  searchControl = new FormControl('');
  filteredSports: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<SportsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sports: any[] }
  ) {
    this.filteredSports = data.sports;
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.filteredSports = searchTerm
        ? data.sports.filter(sport => sport.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : data.sports;
    });
  }

  selectSport(sport: any): void {
    this.dialogRef.close(sport);
  }

  close(): void {
    this.dialogRef.close();
  }
}