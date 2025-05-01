import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-stadium',
  templateUrl: './add-stadium.component.html',
  imports: [CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['./add-stadium.component.css'],
})
export class AddStadiumComponent {
  stadium: any = {
    name: '',
    address: '',
    facilities: '',
    locationText: '',
    locationUrl: '',
  };

  agreed = false;
  imagePreviews: string[] = [];
  locationConfirmed = false;

  sportsOptions: string[] = ['Football', 'Cricket', 'Rugby', 'Hockey', 'Tennis'];
  weekdayOptions: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedSport: string | null = null;
  selectedDay: string = '';
  selectedFromTime: string = '';
  selectedToTime: string = '';
  scheduleRows: { sport: string; day: string; fromTime: string; toTime: string }[] = [];

  constructor(private http: HttpClient) {}

  locateAddress() {
    if (!this.stadium.locationText) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.stadium.locationText}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

          this.stadium.locationUrl = googleMapsUrl;

          window.open(googleMapsUrl, '_blank');
        } else {
          alert('Location not found!');
        }
      })
      .catch(err => {
        console.error('Error fetching location:', err);
        alert('Error finding location');
      });
  }

  confirmLocation() {
    if (this.stadium.locationUrl) {
      this.locationConfirmed = true;
      alert('Location confirmed!');
    } else {
      alert('Please find a location on the map first.');
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  selectSport(sport: string) {
    this.selectedSport = sport;
  }

  addScheduleRow() {
    if (this.selectedSport && this.selectedDay && this.selectedFromTime && this.selectedToTime) {
      if (this.selectedFromTime >= this.selectedToTime) {
        alert('From time must be earlier than To time');
        return;
      }

      this.scheduleRows.push({
        sport: this.selectedSport,
        day: this.selectedDay,
        fromTime: this.selectedFromTime,
        toTime: this.selectedToTime
      });

      this.selectedDay = '';
      this.selectedFromTime = '';
      this.selectedToTime = '';
    } else {
      alert('Please select sport, day, from time, and to time');
    }
  }

  removeRow(index: number) {
    this.scheduleRows.splice(index, 1);
  }

  onSubmit(form: any) {
    if (form.valid && this.locationConfirmed) {
      console.log('Form submitted:', this.stadium);
      console.log('Schedule:', this.scheduleRows);

      const stadiumData = {
        name: this.stadium.name,
        address: this.stadium.address,
        description: this.stadium.facilities,
        images: this.imagePreviews,
        locationUrl: this.stadium.locationUrl,
        schedule: this.scheduleRows,
      };

      this.http.post('http://localhost:5000/api/stadiums/add', stadiumData)
        .subscribe({
          next: (response: any) => {
            console.log('Stadium added successfully!', response);
            alert('Stadium added successfully!');
          },
          error: (error: any) => {
            console.error('Error adding stadium:', error);
            alert(`Error adding stadium: ${error.status} - ${error.statusText}`);
          }
        });
    } else if (!this.locationConfirmed) {
      alert('Please confirm the location before submitting.');
    }
  }
}