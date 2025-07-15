import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PlayerPackagesService } from '../../services/player-packages/player-packages.service';
import { PlayerPackage, PlayerPackageAssignment, Stadium, SubscriptionStats } from '@models/player-package';

@Component({
  selector: 'app-player-packages',
  templateUrl: './player-packages.component.html',
  styleUrls: ['./player-packages.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
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
    private playerPackagesService: PlayerPackagesService,
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
    this.playerPackagesService.getStadiums().subscribe({
      next: (data) => {
        this.stadiums = data || [];
        console.log('Fetched stadiums:', this.stadiums);
      },
      error: (error) => {
        alert(error.message);
        if (error.message.includes('401')) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  fetchPackages() {
    console.log('fetchPackages called');
    this.playerPackagesService.getPlayerPackages().subscribe({
      next: (data) => {
        this.packages = data || [];
        console.log('Fetched packages:', this.packages);
      },
      error: (error) => {
        alert(error.message);
        if (error.message.includes('401')) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  fetchAssignments() {
    console.log('fetchAssignments called');
    this.playerPackagesService.getPlayerPackageAssignments().subscribe({
      next: (data) => {
        this.assignments = data || [];
        console.log('Fetched assignments:', this.assignments);
      },
      error: (error) => {
        alert(error.message);
        if (error.message.includes('401')) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  fetchStats() {
    console.log('fetchStats called');
    this.playerPackagesService.getSubscriptionStats().subscribe({
      next: (data) => {
        this.stats = data || { totalPlayers: 0, activeSubscriptions: 0, expiredSubscriptions: 0, mostPopularPackage: null };
        console.log('Fetched stats:', this.stats);
      },
      error: (error) => {
        alert(error.message);
        if (error.message.includes('401')) {
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
    this.newPackage = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      duration: 0,
      sport: '',
      stadium_id: 0,
      stadium_name: '',
      start_date: '',
      end_date: ''
    };
    this.cdr.detectChanges();
  }

  saveAdd() {
    console.log('Saving new package:', this.newPackage);
    if (!this.newPackage.name || !this.newPackage.price || !this.newPackage.duration || !this.newPackage.sport || !this.newPackage.stadium_id || !this.newPackage.start_date || !this.newPackage.end_date) {
      alert('All fields except description are required.');
      return;
    }
    if (new Date(this.newPackage.start_date) >= new Date(this.newPackage.end_date)) {
      alert('Start date must be earlier than end date.');
      return;
    }
    if (this.newPackage.price < 0) {
      alert('Price must be non-negative.');
      return;
    }
    if (this.newPackage.duration < 1) {
      alert('Duration must be at least 1 day.');
      return;
    }
    this.playerPackagesService.addPlayerPackage(this.newPackage).subscribe({
      next: () => {
        this.showAdd = false;
        this.fetchPackages();
        this.fetchStats();
        alert('Player package added successfully!');
      },
      error: (error) => {
        alert(error.message);
        if (error.message.includes('401')) {
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
  }

  cancelEdit() {
    console.log('cancelEdit called');
    this.showEdit = false;
    this.editedPackage = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      duration: 0,
      sport: '',
      stadium_id: 0,
      stadium_name: '',
      start_date: '',
      end_date: ''
    };
    this.cdr.detectChanges();
  }

  saveEdit() {
    console.log('Saving edit with editedPackage:', this.editedPackage);
    if (!this.editedPackage.name || !this.editedPackage.price || !this.editedPackage.duration || !this.editedPackage.sport || !this.editedPackage.stadium_id || !this.editedPackage.start_date || !this.editedPackage.end_date) {
      alert('All fields except description are required.');
      return;
    }
    if (new Date(this.editedPackage.start_date) >= new Date(this.editedPackage.end_date)) {
      alert('Start date must be earlier than end date.');
      return;
    }
    if (this.editedPackage.price < 0) {
      alert('Price must be non-negative.');
      return;
    }
    if (this.editedPackage.duration < 1) {
      alert('Duration must be at least 1 day.');
      return;
    }
    this.playerPackagesService.updatePlayerPackage(this.editedPackage).subscribe({
      next: () => {
        const index = this.packages.findIndex(p => p.id === this.editedPackage.id);
        if (index !== -1) {
          this.packages[index] = { ...this.editedPackage };
        }
        this.showEdit = false;
        this.fetchStats();
        alert('Player package updated successfully!');
      },
      error: (error) => {
        alert(error.message);
        if (error.message.includes('401')) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  deletePackage(id: number) {
    console.log('deletePackage called with id:', id);
    if (confirm('Are you sure you want to delete this package?')) {
      this.playerPackagesService.deletePlayerPackage(id).subscribe({
        next: () => {
          this.packages = this.packages.filter(p => p.id !== id);
          this.assignments = this.assignments.filter(a => a.id !== id);
          this.fetchStats();
          alert('Player package deleted successfully!');
        },
        error: (error) => {
          alert(error.message);
          if (error.message.includes('401')) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  isActive(assignment: PlayerPackageAssignment): boolean {
    const now = new Date();
    const endDate = new Date(assignment.end_date);
    return endDate > now;
  }
}