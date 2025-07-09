import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AddStadiumService } from '../../services/add-stadium/add-stadium.service';
import { Stadium } from '../../models/stadium';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-stadium',
  templateUrl: './add-stadium.component.html',
  styleUrls: ['./add-stadium.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddStadiumComponent implements OnInit {
  newStadium: Stadium = {
    id: 0,
    name: '',
    address: '',
    google_maps_link: '',
    facilities: '',
    images: [],
    schedule: []
  };
  sportsOptions: string[] = [
    'Football', 'Basketball', 'Tennis', 'Cricket', 'Swimming',
    'Volleyball', 'Badminton', 'Rugby', 'Hockey'
  ];
  weekdayOptions: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  uploadProgress: number = 0;
  uploadError: string | null = null;
  addressError: string | null = null;
  selectedSport: string = '';
  selectedDay: string = '';
  selectedMaxPlayers: number = 0;
  selectedFromTime: string = '';
  selectedToTime: string = '';
  selectedSportPercentage: number = 0;
  locationConfirmed: boolean = false;
  hasNavigatedToMap: boolean = false;
  agreed: boolean = false;
  imageUrls: string[] = [];

  constructor(
    private addStadiumService: AddStadiumService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.resetForm();
  }

  onSubmit() {
    console.log('Submitting stadium:', this.newStadium);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add a stadium.');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.newStadium.name || !this.newStadium.address || !this.newStadium.google_maps_link) {
      alert('Name, Address, and Google Maps Link are required.');
      return;
    }
    if (!this.locationConfirmed) {
      alert('Please confirm the location in Google Maps before submitting.');
      return;
    }
    if (!this.agreed) {
      alert('Please agree to the terms and conditions.');
      return;
    }
    if (this.newStadium.schedule && this.newStadium.schedule.length > 0) {
      for (const schedule of this.newStadium.schedule) {
        if (schedule.day && !this.weekdayOptions.includes(schedule.day)) {
          alert(`Invalid day: ${schedule.day}. Choose a valid day of the week.`);
          return;
        }
        if (schedule.fromTime && schedule.toTime && schedule.fromTime >= schedule.toTime) {
          alert(`Start time must be earlier than end time for ${schedule.sport || 'schedule'}.`);
          return;
        }
        if (schedule.sportPercentage > 20) {
          alert(`Sport percentage for ${schedule.sport} must be 20% or less.`);
          return;
        }
      }
    }
    this.addStadiumService.addStadium(this.newStadium, token).subscribe({
      next: () => {
        alert('Stadium added successfully!');
        this.router.navigate(['/stadium-owner/stadiums']);
      },
      error: (error) => {
        console.error('Error adding stadium:', error);
        alert(`Error adding stadium: ${error.message}`);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadProgress = 0;
      this.uploadError = null;
      const files = Array.from(input.files);
      let completed = 0;
      files.forEach(file => {
        this.addStadiumService.uploadImage(file).subscribe({
          next: (url) => {
            this.newStadium.images = [...this.newStadium.images, url];
            this.imageUrls = [...this.imageUrls, url];
            completed++;
            this.uploadProgress = (completed / files.length) * 100;
            console.log('Uploaded image URL:', url);
            this.cdr.detectChanges();
          },
          error: (error) => {
            this.uploadError = error.message;
            this.uploadProgress = 0;
            console.error('Upload error:', error);
            this.cdr.detectChanges();
          }
        });
      });
    }
  }

  selectSport(sport: string) {
    this.selectedSport = sport;
    console.log('Selected sport:', sport);
  }

  addScheduleRow() {
    this.newStadium.schedule = this.newStadium.schedule || [];
    if (!this.selectedSport || !this.selectedDay || !this.selectedFromTime || !this.selectedToTime || !this.selectedMaxPlayers || !this.selectedSportPercentage) {
      alert('Please fill in all schedule fields.');
      return;
    }
    if (this.selectedFromTime >= this.selectedToTime) {
      alert('Start time must be earlier than end time.');
      return;
    }
    if (this.selectedMaxPlayers < 1) {
      alert('Max players must be at least 1.');
      return;
    }
    if (this.selectedSportPercentage > 20) {
      alert('Sport percentage must be 20% or less.');
      return;
    }
    this.newStadium.schedule.push({
      sport: this.selectedSport,
      day: this.selectedDay,
      fromTime: this.selectedFromTime,
      toTime: this.selectedToTime,
      maxPlayers: this.selectedMaxPlayers,
      sportPercentage: this.selectedSportPercentage
    });
    this.resetScheduleInputs();
    this.cdr.detectChanges();
  }

  removeRow(index: number) {
    this.newStadium.schedule.splice(index, 1);
    this.cdr.detectChanges();
  }

  locateAddress() {
    if (this.newStadium.address) {
      this.addStadiumService.getLocationUrl(this.newStadium.address).subscribe({
        next: (url) => {
          this.newStadium.google_maps_link = url;
          this.addressError = null;
          this.locationConfirmed = false;
          this.hasNavigatedToMap = false;
          console.log('Google Maps URL:', url);
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.addressError = error.message;
          this.newStadium.google_maps_link = '';
          this.hasNavigatedToMap = false;
          console.error('Address error:', error);
          this.cdr.detectChanges();
        }
      });
    } else {
      this.newStadium.google_maps_link = '';
      this.addressError = 'Please enter an address.';
      this.locationConfirmed = false;
      this.hasNavigatedToMap = false;
    }
  }

  confirmLocation() {
    if (this.newStadium.google_maps_link) {
      window.open(this.newStadium.google_maps_link, '_blank');
      this.hasNavigatedToMap = true;
      console.log('Navigated to Google Maps:', this.newStadium.google_maps_link);
      this.cdr.detectChanges();
    } else {
      alert('Please generate a valid Google Maps link first.');
    }
  }

  confirmLocationInMap() {
    if (this.newStadium.google_maps_link && this.hasNavigatedToMap) {
      this.locationConfirmed = true;
      console.log('Location confirmed in map:', this.newStadium.google_maps_link);
      this.cdr.detectChanges();
    } else {
      alert('Please navigate to Google Maps first.');
    }
  }

  resetScheduleInputs() {
    this.selectedSport = '';
    this.selectedDay = '';
    this.selectedMaxPlayers = 0;
    this.selectedFromTime = '';
    this.selectedToTime = '';
    this.selectedSportPercentage = 0;
  }

  resetForm() {
    this.newStadium = {
      id: 0,
      name: '',
      address: '',
      google_maps_link: '',
      facilities: '',
      images: [],
      schedule: []
    };
    this.imageUrls = [];
    this.uploadProgress = 0;
    this.uploadError = null;
    this.addressError = null;
    this.locationConfirmed = false;
    this.hasNavigatedToMap = false;
    this.agreed = false;
    this.resetScheduleInputs();
    this.cdr.detectChanges();
  }
}