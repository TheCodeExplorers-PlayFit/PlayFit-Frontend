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
  selector: 'app-locations-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule],
  templateUrl: './locations-modal.component.html',
  styleUrls: ['./locations-modal.component.css']
})
export class LocationsModalComponent {
  searchControl = new FormControl('');
  filteredLocations: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<LocationsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { locations: any[] }
  ) {
    this.filteredLocations = data.locations;
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.filteredLocations = searchTerm
        ? data.locations.filter(location => location.location_name.toLowerCase().includes(searchTerm.toLowerCase()))
        : data.locations;
    });
  }

  selectLocation(location: any): void {
    this.dialogRef.close(location);
  }

  close(): void {
    this.dialogRef.close();
  }
}