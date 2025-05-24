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
}

interface Stadium {
  id: number;
  name: string;
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
  stadiums: Stadium[] = [];
  newPackage: PlayerPackage = { id: 0, name: '', description: '', price: 0, duration: 0, sport: '', stadium_id: 0, stadium_name: '' };
  editedPackage: PlayerPackage = { id: 0, name: '', description: '', price: 0, duration: 0, sport: '', stadium_id: 0, stadium_name: '' };
  showAdd = false;
  showEdit = false;

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

  enableAdd() {
    console.log('enableAdd called');
    this.newPackage = { id: 0, name: '', description: '', price: 0, duration: 0, sport: '', stadium_id: 0, stadium_name: '' };
    this.showAdd = true;
    this.cdr.detectChanges();
  }

  cancelAdd() {
    console.log('cancelAdd called');
    this.showAdd = false;
    this.newPackage = { id: 0, name: '', description: '', price: 0, duration: 0, sport: '', stadium_id: 0, stadium_name: '' };
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
    if (!this.newPackage.name || !this.newPackage.price || !this.newPackage.duration || !this.newPackage.sport || !this.newPackage.stadium_id) {
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
      stadiumId: this.newPackage.stadium_id
    };
    console.log('Sending payload to add:', payload);
    this.http.post('http://localhost:5000/api/player-packages/add', payload, { headers }).subscribe({
      next: (response) => {
        console.log('Add response:', response);
        this.showAdd = false;
        this.fetchPackages();
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
    this.editedPackage = { id: 0, name: '', description: '', price: 0, duration: 0, sport: '', stadium_id: 0, stadium_name: '' };
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
    if (!this.editedPackage.name || !this.editedPackage.price || !this.editedPackage.duration || !this.editedPackage.sport || !this.editedPackage.stadium_id) {
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
      stadiumId: this.editedPackage.stadium_id
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
          alert('Player package deleted successfully!');
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
}