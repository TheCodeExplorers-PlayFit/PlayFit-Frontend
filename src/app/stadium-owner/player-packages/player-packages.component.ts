import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface PlayerPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  sport: string;
  stadium_id: number;
  stadium_name: string;
  start_date: string;
  end_date: string;
}

interface PlayerPackageAssignment {
  id: number;
  player_id: number;
  player_name: string;
  package_name: string;
  price: number;
  sport: string;
  stadium_id: number;
  stadium_name: string;
  start_date: string;
  end_date: string;
}

interface Stadium {
  id: number;
  name: string;
}

interface SubscriptionStats {
  totalPlayers: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  mostPopularPackage: string | null;
}

@Component({
  selector: 'app-player-packages',
  templateUrl: './player-packages.component.html',
  styleUrls: ['./player-packages.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule]
})
export class PlayerPackagesComponent implements OnInit {
  packages: PlayerPackage[] = [];
  assignments: PlayerPackageAssignment[] = [];
  stadiums: Stadium[] = [];
  newPackage: PlayerPackage = { id: 0, name: '', description: '', price: 0, duration: 0, sport: '', stadium_id: 0, stadium_name: '', start_date: '', end_date: '' };
  editedPackage: PlayerPackage = { id: 0, name: '', description: '', price: 0, duration: 0, sport: '', stadium_id: 0, stadium_name: '', start_date: '', end_date: '' };
  showAdd = false;
  showEdit = false;
  stats: SubscriptionStats = { totalPlayers: 0, activeSubscriptions: 0, expiredSubscriptions: 0, mostPopularPackage: null };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    console.log('PlayerPackagesComponent initialized');
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.fetchStadiums();
    this.fetchPackages();
    this.fetchAssignments();
    this.fetchStats();
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
        console.error('Error fetching stadiums:', error);
        alert(`Error fetching stadiums: ${error.status} - ${error.error?.message || error.statusText}`);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  fetchPackages() {
    console.log('fetchPackages called');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view packages.');
      this.router.navigate(['/login']);
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    this.http.get<PlayerPackage[]>('http://localhost:5000/api/player-packages', { headers }).subscribe({
      next: (data) => {
        this.packages = data || [];
        console.log('Fetched packages:', this.packages);
      },
      error: (error) => {
        console.error('Error fetching packages:', error);
        alert(`Error fetching packages: ${error.status} - ${error.error?.message || error.statusText}`);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  fetchAssignments() {
    console.log('fetchAssignments called');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view package assignments.');
      this.router.navigate(['/login']);
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    this.http.get<PlayerPackageAssignment[]>('http://localhost:5000/api/player-packages/assignments', { headers }).subscribe({
      next: (data) => {
        this.assignments = data || [];
        console.log('Fetched assignments:', this.assignments);
      },
      error: (error) => {
        console.error('Error fetching assignments:', error);
        alert(`Error fetching assignments: ${error.status} - ${error.error?.message || error.statusText}`);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  fetchStats() {
    console.log('fetchStats called');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view stats.');
      this.router.navigate(['/login']);
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    this.http.get<SubscriptionStats>('http://localhost:5000/api/player-packages/stats', { headers }).subscribe({
      next: (data) => {
        this.stats = data || { totalPlayers: 0, activeSubscriptions: 0, expiredSubscriptions: 0, mostPopularPackage: null };
        console.log('Fetched stats:', this.stats);
      },
      error: (error) => {
        console.error('Error fetching stats:', error);
        alert(`Error fetching stats: ${error.status} - ${error.error?.message || error.statusText}`);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  enableAdd() {
    console.log('enableAdd called');
    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    this.newPackage = { 
      id: 0, 
      name: '', 
      description: '', 
      price: 0, 
      duration: 0, 
      sport: '', 
      stadium_id: 0, 
      stadium_name: '', 
      start_date: today, 
      end_date: endDate.toISOString().split('T')[0] 
    };
    this.showAdd = true;
    this.cdr.detectChanges();
  }

  cancelAdd() {
    console.log('cancelAdd called');
    this.showAdd = false;
    this.newPackage = { id: 0, name: '', description: '', price: 0, duration: 0, sport: '', stadium_id: 0, stadium_name: '', start_date: '', end_date: '' };
    this.cdr.detectChanges();
  }

  saveAdd() {
    console.log('Saving new package:', this.newPackage);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add a package.');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.newPackage.name || !this.newPackage.price || !this.newPackage.duration || !this.newPackage.sport || !this.newPackage.stadium_id || !this.newPackage.start_date || !this.newPackage.end_date) {
      alert('All fields except description are required.');
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const payload = {
      name: this.newPackage.name,
      description: this.newPackage.description || null,
      price: this.newPackage.price,
      duration: this.newPackage.duration,
      sport: this.newPackage.sport,
      stadiumId: this.newPackage.stadium_id,
      start_date: this.newPackage.start_date,
      end_date: this.newPackage.end_date
    };
    console.log('Sending payload to add:', payload);
    this.http.post('http://localhost:5000/api/player-packages/add', payload, { headers }).subscribe({
      next: (response) => {
        console.log('Add response:', response);
        this.showAdd = false;
        this.fetchPackages();
        this.fetchStats();
        alert('Player package added successfully!');
      },
      error: (error) => {
        console.error('Error adding package:', error);
        alert(`Error adding package: ${error.status} - ${error.error?.message || error.statusText}`);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  enableEdit(pkg: PlayerPackage) {
    console.log('enableEdit called with package:', pkg);
    if (!pkg) {
      console.error('Package is undefined or null');
      return;
    }
    this.editedPackage = { ...pkg };
    this.showEdit = true;
    this.cdr.detectChanges();
    console.log('showEdit set to:', this.showEdit);
    console.log('Edited package set:', this.editedPackage);
  }

  cancelEdit() {
    console.log('cancelEdit called');
    this.showEdit = false;
    this.editedPackage = { id: 0, name: '', description: '', price: 0, duration: 0, sport: '', stadium_id: 0, stadium_name: '', start_date: '', end_date: '' };
    this.cdr.detectChanges();
    console.log('showEdit set to:', this.showEdit);
  }

  saveEdit() {
    console.log('Saving edit with editedPackage:', this.editedPackage);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save changes.');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.editedPackage.name || !this.editedPackage.price || !this.editedPackage.duration || !this.editedPackage.sport || !this.editedPackage.stadium_id || !this.editedPackage.start_date || !this.editedPackage.end_date) {
      alert('All fields except description are required.');
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const payload = {
      id: this.editedPackage.id,
      name: this.editedPackage.name,
      description: this.editedPackage.description || null,
      price: this.editedPackage.price,
      duration: this.editedPackage.duration,
      sport: this.editedPackage.sport,
      stadiumId: this.editedPackage.stadium_id,
      start_date: this.editedPackage.start_date,
      end_date: this.editedPackage.end_date
    };
    console.log('Sending payload to update:', payload);
    this.http.put(`http://localhost:5000/api/player-packages/${this.editedPackage.id}`, payload, { headers }).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        const index = this.packages.findIndex(p => p.id === this.editedPackage.id);
        if (index !== -1) {
          this.packages[index] = { ...this.editedPackage };
        }
        this.showEdit = false;
        this.cdr.detectChanges();
        alert('Player package updated successfully!');
        this.fetchPackages();
        this.fetchStats();
      },
      error: (error) => {
        console.error('Error updating package:', error);
        alert(`Error updating package: ${error.status} - ${error.error?.message || error.statusText}`);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  deletePackage(id: number) {
    console.log('deletePackage called with id:', id);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to delete package.');
      this.router.navigate(['/login']);
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    if (confirm('Are you sure you want to delete this package?')) {
      this.http.delete(`http://localhost:5000/api/player-packages/${id}`, { headers }).subscribe({
        next: () => {
          this.packages = this.packages.filter(p => p.id !== id);
          this.assignments = this.assignments.filter(a => a.id !== id);
          alert('Player package deleted successfully!');
          this.fetchStats();
        },
        error: (error) => {
          console.error('Error deleting package:', error);
          alert(`Error deleting package: ${error.status} - ${error.error?.message || error.statusText}`);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  isActive(assignment: PlayerPackageAssignment): boolean {
    const now = new Date('2025-05-24 :09:00+05:30'); // Current date and time: May 24, 2025, 04:09 PM IST
    const endDate = new Date(assignment.end_date);
    return endDate > now;
  }
}