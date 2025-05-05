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
  schedules: { 
    sport: string; 
    day: string; 
    date?: string; 
    start_time: string; 
    end_time: string; 
    max_players: number; 
    stadium_sportcost: number; 
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
  editedStadium: Stadium = { id: 0, name: '', address: '', google_maps_link: '', facilities: '', images: [], schedules: [] };
  showEdit = false;
  weekdayOptions: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
        console.log(`Images for ${stadium.name}:`, stadium.images);
        allImages.push(...stadium.images);
      } else {
        console.log(`No images for ${stadium.name}`);
      }
    });
    console.log('Total images collected:', allImages);
    return allImages;
  }

  onImageError(event: Event) {
    console.error('Image failed to load:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).style.display = 'none';
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
        console.log('Fetched stadiums with images:', this.stadiums);
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
      schedules: Array.isArray(stadium.schedules) ? stadium.schedules.map(s => ({
        ...s,
        sport: s.sport || '',
        day: s.day || '',
        date: s.date || '',
        start_time: s.start_time || '',
        end_time: s.end_time || '',
        max_players: s.max_players || 0,
        stadium_sportcost: s.stadium_sportcost || 0
      })) : []
    };
    this.showEdit = true;
    this.cdr.detectChanges(); // Force change detection
    console.log('showEdit set to:', this.showEdit);
    console.log('Edited stadium set:', this.editedStadium);
  }

  cancelEdit() {
    console.log('cancelEdit called');
    this.showEdit = false;
    this.editedStadium = { id: 0, name: '', address: '', google_maps_link: '', facilities: '', images: [], schedules: [] };
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
    if (this.editedStadium.schedules && this.editedStadium.schedules.length > 0) {
      for (const schedule of this.editedStadium.schedules) {
        if (schedule.day && !this.weekdayOptions.includes(schedule.day)) {
          alert(`Invalid day: ${schedule.day}. Choose a valid day of the week.`);
          return;
        }
        if (schedule.start_time && schedule.end_time && schedule.start_time >= schedule.end_time) {
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
      schedules: this.editedStadium.schedules.map(schedule => ({
        sport: schedule.sport,
        day: schedule.day,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        max_players: schedule.max_players,
        stadium_sportcost: schedule.stadium_sportcost
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
    this.editedStadium.schedules = this.editedStadium.schedules || [];
    this.editedStadium.schedules.push({
      sport: '',
      day: '',
      start_time: '',
      end_time: '',
      max_players: 0,
      stadium_sportcost: 0
    });
  }

  removeSchedule(index: number) {
    console.log('removeSchedule called with index:', index);
    this.editedStadium.schedules.splice(index, 1);
  }
}