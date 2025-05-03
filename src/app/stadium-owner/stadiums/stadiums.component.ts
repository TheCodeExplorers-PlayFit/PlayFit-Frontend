import { Component, OnInit } from '@angular/core';
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
    date: string; 
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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchStadiums();
  }

  getAllImages(): string[] {
    return this.stadiums.flatMap(stadium => Array.isArray(stadium.images) ? stadium.images : []);
  }

  private getErrorMessage(error: any): string {
    return error.error?.message || error.statusText || 'Unknown error';
  }

  fetchStadiums() {
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
        console.log('Fetched stadiums:', this.stadiums);
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
    this.router.navigate(['/stadium-owner/add-stadium']);
  }

  enableEdit(stadium: Stadium) {
    this.editedStadium = {
      ...stadium,
      schedules: Array.isArray(stadium.schedules) ? stadium.schedules.map(s => ({ ...s })) : []
    };
    this.showEdit = true;
  }

  cancelEdit() {
    this.showEdit = false;
    this.editedStadium = { id: 0, name: '', address: '', google_maps_link: '', facilities: '', images: [], schedules: [] };
  }

  saveEdit() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save changes.');
      this.router.navigate(['/login']);
      return;
    }
    // Validate schedules
    for (const schedule of this.editedStadium.schedules) {
      if (!schedule.sport || !schedule.day || !schedule.date || !schedule.start_time || !schedule.end_time || !schedule.max_players || schedule.max_players <= 0 || !schedule.stadium_sportcost || schedule.stadium_sportcost <= 0) {
        alert('All schedule fields (sport, day, date, start time, end time, max players, sport cost) must be filled and valid.');
        return;
      }
      if (schedule.start_time >= schedule.end_time) {
        alert(`Start time must be earlier than end time for ${schedule.sport}.`);
        return;
      }
      if (!this.weekdayOptions.includes(schedule.day)) {
        alert(`Invalid day: ${schedule.day}. Choose a valid day of the week.`);
        return;
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
      images: this.editedStadium.images,
      schedules: this.editedStadium.schedules
    };
    console.log('Saving stadium update:', payload);
    this.http.put(`http://localhost:5000/api/stadiums/${this.editedStadium.id}`, payload, { headers }).subscribe({
      next: () => {
        const index = this.stadiums.findIndex(s => s.id === this.editedStadium.id);
        if (index !== -1) {
          this.stadiums[index] = { ...this.editedStadium };
        }
        this.showEdit = false;
        alert('Stadium updated successfully!');
        this.fetchStadiums(); // Refresh data
      },
      error: (error) => {
        console.error('Error updating stadium:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
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
    this.editedStadium.schedules = this.editedStadium.schedules || [];
    this.editedStadium.schedules.push({
      sport: '',
      day: '',
      date: '',
      start_time: '',
      end_time: '',
      max_players: 0,
      stadium_sportcost: 0
    });
  }

  removeSchedule(index: number) {
    this.editedStadium.schedules.splice(index, 1);
  }
}