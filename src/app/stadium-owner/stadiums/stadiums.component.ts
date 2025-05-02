import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Stadium {
  id: number;
  name: string;
  address: string;
  google_maps_link: string;
  facilities: string;
  images: string[];
  schedules: { sport: string; session_date: string; start_time: string; end_time: string; max_players: number }[];
  editing?: boolean;
}

@Component({
  selector: 'app-stadiums',
  templateUrl: './stadiums.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class StadiumsComponent implements OnInit {
  stadiums: Stadium[] = [];
  editedStadium: Stadium = { id: 0, name: '', address: '', google_maps_link: '', facilities: '', images: [], schedules: [] };
  showEdit = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchStadiums();
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
        this.stadiums = data;
      },
      error: (error) => {
        console.error('Error fetching stadiums:', error);
        alert(`Error fetching stadiums: ${error.status} - ${error.statusText}`);
      }
    });
  }

  enableEdit(stadium: Stadium) {
    this.editedStadium = { ...stadium };
    this.showEdit = true;
    stadium.editing = true;
  }

  cancelEdit() {
    this.showEdit = false;
    this.stadiums.forEach(s => s.editing = false);
  }

  saveEdit() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save changes.');
      this.router.navigate(['/login']);
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    this.http.put(`http://localhost:5000/api/stadiums/${this.editedStadium.id}`, this.editedStadium, { headers }).subscribe({
      next: () => {
        const index = this.stadiums.findIndex(s => s.id === this.editedStadium.id);
        if (index !== -1) {
          this.stadiums[index] = { ...this.editedStadium };
        }
        this.showEdit = false;
        this.stadiums.forEach(s => s.editing = false);
        alert('Stadium updated successfully!');
        this.fetchStadiums(); // Refresh data
      },
      error: (error) => {
        console.error('Error updating stadium:', error);
        alert(`Error updating stadium: ${error.status} - ${error.statusText}`);
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
          console.error('Error deleting stadium:', error);
          alert(`Error deleting stadium: ${error.status} - ${error.statusText}`);
        }
      });
    }
  }
}

