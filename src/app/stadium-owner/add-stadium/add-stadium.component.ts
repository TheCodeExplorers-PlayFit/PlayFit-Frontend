import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});



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
  
  constructor(private router: Router, private http: HttpClient) {}


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
    const formData = new FormData();
  
    // Add all form fields
    Object.entries(this.stadium).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
  
    // Add selected files
    const fileInput: HTMLInputElement | null = document.querySelector('input[type="file"]');
    if (fileInput?.files) {
      for (let i = 0; i < fileInput.files.length; i++) {
        formData.append('images', fileInput.files[i]);
      }
    }
  
    this.http.post('http://localhost:5000/api/stadiums/add', formData).subscribe({
      next: (res) => {
        alert('Stadium added!');
        this.router.navigate(['/stadium-owner/stadiums']);
      },
      error: (err) => {
        console.error('Failed to add stadium:', err);
        alert('Failed to add stadium');
      },
    });
  }
  
}
