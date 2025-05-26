import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-complaints.component.html',
  styleUrl: './player-complaints.component.css'
})
export class PlayerComplaintsComponent implements OnInit {
  stadiums: any[] = [];
  coaches: any[] = [];
  selectedModal: 'stadium' | 'coach' | 'system' | null = null;
  showModal: boolean = false;
  selectedStadiumId: number | null = null;
  selectedCoachId: number | null = null;
  complaintDescription: string = '';
  searchQuery: string = '';
  playerId = 18; // Hardcoded for demo; replace with auth service
  errorMessage: string = '';
  private apiBaseUrl = 'http://localhost:5000/api/complaints'; // Updated to port 5000

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchStadiums();
    this.fetchCoaches();
  }

  fetchStadiums(): void {
    console.log(`Fetching stadiums from ${this.apiBaseUrl}/stadiums`);
    this.http.get<any[]>(`${this.apiBaseUrl}/stadiums`).subscribe({
      next: (data) => {
        console.log('Stadiums fetched:', data);
        this.stadiums = data;
        if (data.length === 0) {
          this.errorMessage = 'No stadiums found in the database';
        }
      },
      error: (err) => {
        console.error('Error fetching stadiums:', err);
        this.errorMessage = `Failed to load stadiums: ${err.statusText || err.message || 'Server not reachable. Check if backend is running on port 5000.'}`;
      }
    });
  }

  fetchCoaches(): void {
    console.log(`Fetching coaches from ${this.apiBaseUrl}/coaches`);
    this.http.get<any[]>(`${this.apiBaseUrl}/coaches`).subscribe({
      next: (data) => {
        console.log('Coaches fetched:', data);
        this.coaches = data;
        if (data.length === 0) {
          this.errorMessage = 'No coaches found in the database';
        }
      },
      error: (err) => {
        console.error('Error fetching coaches:', err);
        this.errorMessage = `Failed to load coaches: ${err.statusText || err.message || 'Server not reachable. Check if backend is running on port 5000.'}`;
      }
    });
  }

  openModal(type: 'stadium' | 'coach' | 'system'): void {
    console.log('Opening modal:', type);
    this.selectedModal = type;
    this.showModal = true;
    this.selectedStadiumId = null;
    this.selectedCoachId = null;
    this.complaintDescription = '';
    this.searchQuery = '';
    this.errorMessage = '';
  }

  closeModal(): void {
    console.log('Closing modal');
    this.showModal = false;
    this.selectedModal = null;
  }

  submitComplaint(): void {
    console.log('Submitting complaint:', {
      selectedModal: this.selectedModal,
      stadiumId: this.selectedStadiumId,
      coachId: this.selectedCoachId,
      description: this.complaintDescription
    });
    if (!this.complaintDescription.trim()) {
      this.errorMessage = 'Please enter a complaint description';
      return;
    }

    const payload: any = {
      player_id: this.playerId,
      type: this.selectedModal,
      description: this.complaintDescription
    };

    if (this.selectedModal === 'stadium') {
      if (!this.selectedStadiumId) {
        this.errorMessage = 'Please select a stadium';
        return;
      }
      payload.stadium_id = this.selectedStadiumId;
    } else if (this.selectedModal === 'coach') {
      if (!this.selectedCoachId) {
        this.errorMessage = 'Please select a coach';
        return;
      }
      payload.coach_id = this.selectedCoachId;
    }

    this.http.post(`${this.apiBaseUrl}/submit`, payload).subscribe({
      next: () => {
        console.log('Complaint submitted successfully');
        this.closeModal();
        alert('Complaint submitted successfully');
      },
      error: (err) => {
        console.error('Error submitting complaint:', err);
        this.errorMessage = `Failed to submit complaint: ${err.statusText || err.message || 'Server not reachable.'}`;
      }
    });
  }

  filteredStadiums(): any[] {
    const filtered = this.stadiums.filter(s =>
      s.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log('Filtered stadiums:', filtered);
    return filtered;
  }

  filteredCoaches(): any[] {
    const filtered = this.coaches.filter(c =>
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log('Filtered coaches:', filtered);
    return filtered;
  }
}