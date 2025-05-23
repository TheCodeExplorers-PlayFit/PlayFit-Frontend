import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Stadium {
  id: number;
  name: string;
  address: string;
  google_maps_link: string;
  facilities: string;
  images: string[];
  schedule: { 
    sport: string; 
    day: string; 
    fromTime: string; 
    toTime: string; 
    maxPlayers: number; 
    sportPercentage: number; 
  }[];
}

@Component({
  selector: 'app-stadiums',
  templateUrl: './stadiums.component.html',
  styleUrls: ['./stadiums.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule]
})
export class StadiumsComponent implements OnInit {
  stadiums: Stadium[] = [];
  editedStadium: Stadium = { id: 0, name: '', address: '', google_maps_link: '', facilities: '', images: [], schedule: [] };
  showEdit = false;
  weekdayOptions: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  uploadProgress: number = 0;
  uploadError: string | null = null;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    console.log('StadiumsComponent initialized');
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.fetchStadiums();
  }

  getAllImages(): string[] {
    const allImages: string[] = [];
    this.stadiums.forEach(stadium => {
      if (Array.isArray(stadium.images) && stadium.images.length > 0) {
        const validImages = stadium.images.filter(img => this.isValidImagePath(img));
        console.log(`Valid images for ${stadium.name}:`, validImages);
        allImages.push(...validImages);
      } else {
        console.log(`No images for ${stadium.name}:`, stadium.images);
      }
    });
    console.log('Total images collected:', allImages);
    return allImages;
  }

  private isValidImagePath(img: string): boolean {
    if (!img || typeof img !== 'string') {
      console.warn('Invalid image path:', img);
      return false;
    }
    // Check for valid Cloudinary URLs (or other valid URLs)
    const isValid = img.startsWith('https://') || img.startsWith('http://');
    if (!isValid) {
      console.warn('Skipping invalid image path:', img);
    }
    return isValid;
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.error('Image failed to load:', {
      src: imgElement.src,
      error: event
    });
    imgElement.classList.add('image-placeholder');
    imgElement.src = ''; // Clear src to prevent further errors
  }

  onFileSelected(event: Event) {
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
    formData.append('folder', 'stadiums');

    const uploadUrl = 'https://api.cloudinary.com/v1_1/dubclskme/image/upload'; // Replace with your Cloud Name

    fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          this.editedStadium.images = [...this.editedStadium.images, data.secure_url];
          this.uploadProgress = 100;
          this.cdr.detectChanges();
          console.log('Uploaded image URL:', data.secure_url);
          console.log('Updated editedStadium.images:', this.editedStadium.images);
        } else {
          throw new Error('Upload failed');
        }
      })
      .catch(error => {
        this.uploadError = `Upload failed: ${error.message}`;
        this.uploadProgress = 0;
        console.error('Upload error:', error);
      });
  }

  removeImage(index: number) {
    console.log('Removing image at index:', index);
    this.editedStadium.images.splice(index, 1);
    console.log('Updated editedStadium.images:', this.editedStadium.images);
    this.cdr.detectChanges();
  }

  private getErrorMessage(error: any): string {
    return error.error?.message || error.statusText || 'Unknown error';
  }

  fetchStadiums() {
    console.log('fetchStadiums called');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view stadiums.');
      this.router.navigate(['/login']);
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    this.http.get<Stadium[]>('http://localhost:5000/api/stadiums', { headers }).subscribe({
      next: (data) => {
        this.stadiums = data || [];
        console.log('Fetched stadiums with schedule:', this.stadiums);
      },
      error: (error) => {
        console.error('Error fetching stadiums:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        const message = this.getErrorMessage(error);
        alert(`Error fetching stadiums: ${error.status} - ${message}`);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  navigateToAddStadium() {
    console.log('Navigating to add-stadium');
    this.router.navigate(['/stadium-owner/add-stadium']);
  }

  enableEdit(stadium: Stadium) {
    console.log('enableEdit called with stadium:', stadium);
    if (!stadium) {
      console.error('Stadium is undefined or null');
      return;
    }
    this.editedStadium = {
      ...stadium,
      schedule: Array.isArray(stadium.schedule) ? stadium.schedule.map(s => ({
        sport: s.sport || '',
        day: s.day || '',
        fromTime: s.fromTime || '',
        toTime: s.toTime || '',
        maxPlayers: s.maxPlayers || 0,
        sportPercentage: s.sportPercentage || 0
      })) : [],
      images: Array.isArray(stadium.images) ? [...stadium.images] : []
    };
    this.showEdit = true;
    this.cdr.detectChanges();
    console.log('showEdit set to:', this.showEdit);
    console.log('Edited stadium set:', this.editedStadium);
  }

  cancelEdit() {
    console.log('cancelEdit called');
    this.showEdit = false;
    this.editedStadium = { id: 0, name: '', address: '', google_maps_link: '', facilities: '', images: [], schedule: [] };
    this.cdr.detectChanges();
    console.log('showEdit set to:', this.showEdit);
  }

  saveEdit() {
    console.log('Saving edit with editedStadium:', this.editedStadium);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save changes.');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.editedStadium.name || !this.editedStadium.address || !this.editedStadium.google_maps_link) {
      alert('Name, Address, and Google Maps Link are required.');
      return;
    }
    if (this.editedStadium.schedule && this.editedStadium.schedule.length > 0) {
      for (const schedule of this.editedStadium.schedule) {
        if (schedule.day && !this.weekdayOptions.includes(schedule.day)) {
          alert(`Invalid day: ${schedule.day}. Choose a valid day of the week.`);
          return;
        }
        if (schedule.fromTime && schedule.toTime && schedule.fromTime >= schedule.toTime) {
          alert(`Start time must be earlier than end time for ${schedule.sport || 'schedule'}.`);
          return;
        }
      }
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const payload = {
      id: this.editedStadium.id,
      name: this.editedStadium.name,
      address: this.editedStadium.address,
      google_maps_link: this.editedStadium.google_maps_link,
      facilities: this.editedStadium.facilities || null,
      images: this.editedStadium.images || [],
      schedule: this.editedStadium.schedule.map(schedule => ({
        sport: schedule.sport,
        day: schedule.day,
        fromTime: schedule.fromTime,
        toTime: schedule.toTime,
        maxPlayers: schedule.maxPlayers,
        sportPercentage: schedule.sportPercentage
      }))
    };
    console.log('Sending payload to update:', JSON.stringify(payload, null, 2));
    this.http.put(`http://localhost:5000/api/stadiums/${this.editedStadium.id}`, payload, { headers }).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        const index = this.stadiums.findIndex(s => s.id === this.editedStadium.id);
        if (index !== -1) {
          this.stadiums[index] = { ...this.editedStadium };
        }
        this.showEdit = false;
        this.cdr.detectChanges();
        alert('Stadium updated successfully!');
        this.fetchStadiums();
      },
      error: (error) => {
        console.error('Error updating stadium:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          payloadSent: payload
        });
        const message = this.getErrorMessage(error);
        alert(`Error updating stadium: ${error.status} - ${message}`);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  deleteStadium(id: number) {
    console.log('deleteStadium called with id:', id);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to delete stadium.');
      this.router.navigate(['/login']);
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    if (confirm('Are you sure you want to delete this stadium?')) {
      this.http.delete(`http://localhost:5000/api/stadiums/${id}`, { headers }).subscribe({
        next: () => {
          this.stadiums = this.stadiums.filter(s => s.id !== id);
          alert('Stadium deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting stadium:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          const message = this.getErrorMessage(error);
          alert(`Error deleting stadium: ${error.status} - ${message}`);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  addSchedule() {
    console.log('addSchedule called');
    this.editedStadium.schedule = this.editedStadium.schedule || [];
    this.editedStadium.schedule.push({
      sport: '',
      day: '',
      fromTime: '',
      toTime: '',
      maxPlayers: 0,
      sportPercentage: 0
    });
  }

  removeSchedule(index: number) {
    console.log('removeSchedule called with index:', index);
    this.editedStadium.schedule.splice(index, 1);
  }
}