import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-stadium',
  templateUrl: './add-stadium.component.html',
  imports: [CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['./add-stadium.component.css'],
  standalone: true
})
export class AddStadiumComponent {
  stadium: any = {
    name: '',
    address: '',
    facilities: '',
    locationText: '',
    locationUrl: ''
  };

  agreed = false;
  imageUrls: string[] = [];
  uploadProgress: number = 0;
  uploadError: string | null = null;
  locationConfirmed = false;
  sportsOptions: string[] = ['Football', 'Basketball', 'Tennis', 'Cricket', 'Swimming', 'Volleyball', 'Badminton', 'Rugby', 'Hockey'];
  weekdayOptions: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedSport: string | null = null;
  selectedDay: string = '';
  selectedFromTime: string = '';
  selectedToTime: string = '';
  selectedMaxPlayers: number | null = null;
  selectedSportPercentage: number | null = null;
  scheduleRows: { sport: string; day: string; fromTime: string; toTime: string; maxPlayers: number; sportPercentage: number }[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  locateAddress() {
    if (!this.stadium.locationText) {
      alert('Please enter a location.');
      return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.stadium.locationText}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
          this.stadium.locationUrl = googleMapsUrl;
          window.open(googleMapsUrl, '_blank');
          console.log('Location URL set:', googleMapsUrl);
        } else {
          alert('Location not found!');
        }
      })
      .catch(err => {
        console.error('Error fetching location:', err);
        alert('Error finding location. Please try again.');
      });
  }

  confirmLocation() {
    if (this.stadium.locationUrl) {
      this.locationConfirmed = true;
      alert('Location confirmed!');
      console.log('locationConfirmed:', this.locationConfirmed);
    } else {
      alert('Please find a location on the map first.');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadProgress = 0;
      this.uploadError = null;
      const files = Array.from(input.files);
      files.forEach(file => this.uploadToCloudinary(file));
    }
  }

  uploadToCloudinary(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'imageuploading'); // Replace with your preset
    formData.append('cloud_name', 'dubclskme'); // Replace with your Cloud Name
    formData.append('folder', 'Uploads'); // Optional: organize in a folder

    const uploadUrl = 'https://api.cloudinary.com/v1_1/dubclskme/image/upload'; // Replace with your Cloud Name

    fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          this.imageUrls.push(data.secure_url);
          this.uploadProgress = 100;
        } else {
          throw new Error('Upload failed');
        }
      })
      .catch(error => {
        this.uploadError = `Upload failed: ${error.message}`;
        this.uploadProgress = 0;
      });
  }

  selectSport(sport: string) {
    this.selectedSport = sport;
    this.selectedDay = '';
    this.selectedFromTime = '';
    this.selectedToTime = '';
    this.selectedMaxPlayers = null;
    this.selectedSportPercentage = null;
  }

  addScheduleRow() {
    if (
      this.selectedSport &&
      this.selectedDay &&
      this.selectedFromTime &&
      this.selectedToTime &&
      this.selectedMaxPlayers !== null &&
      this.selectedMaxPlayers > 0 &&
      this.selectedSportPercentage !== null &&
      this.selectedSportPercentage >= 0 && this.selectedSportPercentage <= 100
    ) {
      if (this.selectedFromTime >= this.selectedToTime) {
        alert('From time must be earlier than To time');
        return;
      }
      this.scheduleRows.push({
        sport: this.selectedSport,
        day: this.selectedDay,
        fromTime: this.selectedFromTime,
        toTime: this.selectedToTime,
        maxPlayers: this.selectedMaxPlayers,
        sportPercentage: this.selectedSportPercentage
      });
      console.log('Schedule Rows:', this.scheduleRows);
      this.selectedSport = null;
      this.selectedDay = '';
      this.selectedFromTime = '';
      this.selectedToTime = '';
      this.selectedMaxPlayers = null;
      this.selectedSportPercentage = null;
    } else {
      alert('Please select sport, day, from time, to time, a valid number of max players, and a sport cost percentage (0-100)');
      console.log('Schedule fields:', {
        sport: this.selectedSport,
        day: this.selectedDay,
        fromTime: this.selectedFromTime,
        toTime: this.selectedToTime,
        maxPlayers: this.selectedMaxPlayers,
        sportPercentage: this.selectedSportPercentage
      });
    }
  }

  removeRow(index: number) {
    this.scheduleRows.splice(index, 1);
  }

  onSubmit(form: NgForm) {
    console.log('Form Valid:', form.valid);
    console.log('Form Value:', form.value);
    console.log('locationConfirmed:', this.locationConfirmed);
    console.log('scheduleRows:', this.scheduleRows);
    console.log('agreed:', this.agreed);
    if (form.valid && this.locationConfirmed && this.agreed && this.scheduleRows.length > 0 && this.imageUrls.length > 0) {
      const stadiumData = {
        name: this.stadium.name,
        address: this.stadium.address,
        google_maps_link: this.stadium.locationUrl,
        facilities: this.stadium.facilities,
        images: this.imageUrls,
        schedule: this.scheduleRows.map(row => ({
          sport: row.sport,
          day: row.day,
          fromTime: row.fromTime,
          toTime: row.toTime,
          maxPlayers: row.maxPlayers,
          sportPercentage: row.sportPercentage
        }))
      };
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to submit the form.');
        this.router.navigate(['/login']);
        return;
      }
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      console.log('Submitting stadium data:', stadiumData);
      this.http.post('http://localhost:5000/api/stadiums/add', stadiumData, { headers })
        .subscribe({
          next: (response: any) => {
            console.log('Stadium added successfully!', response);
            alert('Stadium added successfully!');
            form.reset();
            this.stadium = { name: '', address: '', facilities: '', locationText: '', locationUrl: '' };
            this.imageUrls = [];
            this.scheduleRows = [];
            this.locationConfirmed = false;
            this.agreed = false;
            this.router.navigate(['/stadium-owner/stadiums']);
          },
          error: (error: any) => {
            console.error('Error adding stadium:', error);
            const message = error.error?.message || error.message || 'An unexpected error occurred';
            console.log('Error details:', {
              status: error.status,
              statusText: error.statusText,
              error: error.error,
              message
            });
            alert(`Error adding stadium: ${message}`);
            if (error.status === 401) {
              this.router.navigate(['/login']);
            }
          }
        });
    } else {
      let errorMessage = 'Please fix the following:';
      if (!form.valid) errorMessage += '\n- Fill all required fields (Name, Address, Facilities).';
      if (!this.locationConfirmed) errorMessage += '\n- Confirm the location.';
      if (!this.agreed) errorMessage += '\n- Agree to terms and conditions.';
      if (!this.scheduleRows.length) errorMessage += '\n- Add at least one schedule row.';
      if (!this.imageUrls.length) errorMessage += '\n- Upload at least one image.';
      alert(errorMessage);
      console.log('Form submission failed:', errorMessage);
    }
  }
}