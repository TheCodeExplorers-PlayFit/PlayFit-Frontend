import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-stadium',
  templateUrl: './add-stadium.component.html',
  imports: [CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['./add-stadium.component.css'],
})
export class AddStadiumComponent implements AfterViewInit {
  stadium: any = {
    name: '',
    id: '',
    address: '',
    facilities: '',
    locationText: '',
  };

  agreed = false;
  imagePreviews: string[] = [];
  map: any;
  marker: any;

  // Sport schedule related
  sportsOptions: string[] = ['Football', 'Cricket', 'Rugby', 'Hockey', 'Tennis'];
  weekdayOptions: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedSport: string | null = null;
  selectedDay: string = '';
  selectedFromTime: string = '';
  selectedToTime: string = '';
  scheduleRows: { sport: string; day: string; fromTime: string; toTime: string }[] = [];

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([6.9271, 79.8612], 13); // Default to Colombo
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker([6.9271, 79.8612], { draggable: true }).addTo(this.map);
    this.marker.on('dragend', () => {
      const pos = this.marker.getLatLng();
      console.log('Selected position:', pos);
    });
  }

  locateAddress() {
    if (!this.stadium.locationText) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.stadium.locationText}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.map.setView([lat, lon], 15);
          this.marker.setLatLng([lat, lon]);
        } else {
          alert('Location not found!');
        }
      });
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
    if (form.valid) {
      console.log('Form submitted:', this.stadium);
      console.log('Schedule:', this.scheduleRows);
      // Add backend integration here
    }
  }
}
