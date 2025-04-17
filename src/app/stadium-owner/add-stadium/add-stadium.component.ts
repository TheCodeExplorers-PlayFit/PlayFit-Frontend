import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-add-stadium',
  standalone: true,
  templateUrl: './add-stadium.component.html',
  styleUrls: ['./add-stadium.component.css'],
  imports: [FormsModule, CommonModule],
})
export class AddStadiumComponent implements AfterViewInit {
  stadium = {
    name: '',
    id: '',
    address: '',
    sports: '',
    facilities: '',
    locationText: '',
    latitude: null as number | null,
    longitude: null as number | null,
  };

  agreed = false;
  imagePreviews: string[] = [];

  private map!: L.Map;
  private marker!: L.Marker;
  
  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([7.8731, 80.7718], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker([7.8731, 80.7718], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.stadium.latitude = position.lat;
      this.stadium.longitude = position.lng;
    });
    setTimeout(() => this.map.invalidateSize(), 100);

  }

  locateAddress(): void {
    if (!this.stadium.locationText) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.stadium.locationText)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.stadium.latitude = lat;
          this.stadium.longitude = lon;

          this.map.setView([lat, lon], 15);
          this.marker.setLatLng([lat, lon]);
        } else {
          alert('Location not found!');
        }
      })
      .catch(() => alert('Error fetching location'));
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    this.imagePreviews = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  onSubmit(): void {
    console.log('Form Submitted', this.stadium);
    alert('Form submitted!');
    this.router.navigate(['/stadium-owner/stadium']);
  }
}
