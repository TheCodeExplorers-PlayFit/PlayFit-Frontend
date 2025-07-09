import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; 

@Component({
  selector: 'app-coach-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './CoachComplaints.component.html',
  styleUrls: ['./CoachComplaints.component.css']
})
export class CoachComplaintsComponent implements OnInit {
  stadiums: any[] = [];
  selectedModal: 'stadium' | 'system' | null = null;
  showModal: boolean = false;
  selectedStadiumId: number | null = null;
  complaintDescription: string = '';
  searchQuery: string = '';
  coachId: number | null = null; // Retrieved from AuthService
  errorMessage: string = '';
  private apiBaseUrl = 'http://localhost:5000/api/complaints'; // Updated to port 5000

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    console.log('User data from AuthService:', user);
    if (user && user.role === 'coach') {
      this.coachId = user.id;
      console.log('Coach ID retrieved:', this.coachId);
      this.fetchStadiums();
    } else {
      this.errorMessage = 'Please log in as a coach to file complaints.';
    }
  }

  fetchStadiums(): void {
    console.log(`Fetching stadiums from ${this.apiBaseUrl}/stadiums at ${new Date().toLocaleString()}`);
    this.http.get<any>(`${this.apiBaseUrl}/stadiums`).subscribe({
      next: (response) => {
        console.log('Raw response from backend:', response);
        // Handle different response structures
        let data = response;
        if (!Array.isArray(response)) {
          // If response is an object with a 'data' property, use that
          data = response.data || [];
          console.log('Extracted data from response:', data);
        }
        // Validate and assign stadiums
        this.stadiums = Array.isArray(data) ? data.filter(item => item && typeof item === 'object' && 'id' in item && 'name' in item) : [];
        console.log('Processed stadiums:', this.stadiums);
        if (this.stadiums.length === 0) {
          this.errorMessage = 'No stadiums found in the database. Please ensure the backend endpoint is returning data.';
        } else {
          this.errorMessage = ''; // Clear error if data is received
        }
      },
      error: (err) => {
        console.error('Error fetching stadiums:', err, `at ${new Date().toLocaleString()}`);
        this.errorMessage = `Failed to load stadiums: ${err.statusText || err.message || 'Server not reachable. Check if backend is running on port 5000.'}`;
      }
    });
  }

  openModal(type: 'stadium' | 'system'): void {
    console.log('Opening modal:', type, `at ${new Date().toLocaleString()}`);
    this.selectedModal = type;
    this.showModal = true;
    this.selectedStadiumId = null;
    this.complaintDescription = '';
    this.searchQuery = '';
    this.errorMessage = '';
  }

  closeModal(): void {
    console.log('Closing modal', `at ${new Date().toLocaleString()}`);
    this.showModal = false;
    this.selectedModal = null;
  }

  submitComplaint(): void {
    console.log('Submitting complaint:', {
      selectedModal: this.selectedModal,
      stadiumId: this.selectedStadiumId,
      description: this.complaintDescription
    }, `at ${new Date().toLocaleString()}`);
    if (!this.complaintDescription.trim()) {
      this.errorMessage = 'Please enter a complaint description';
      return;
    }

    if (!this.coachId) {
      this.errorMessage = 'Coach ID not available. Please log in.';
      return;
    }

    const payload: any = {
      coach_id: this.coachId,
      type: this.selectedModal,
      description: this.complaintDescription
    };

    if (this.selectedModal === 'stadium') {
      if (!this.selectedStadiumId) {
        this.errorMessage = 'Please select a stadium';
        return;
      }
      payload.stadium_id = this.selectedStadiumId;
    }

    this.http.post(`${this.apiBaseUrl}/submit`, payload).subscribe({
      next: () => {
        console.log('Complaint submitted successfully', `at ${new Date().toLocaleString()}`);
        this.closeModal();
        alert('Complaint submitted successfully');
      },
      error: (err) => {
        console.error('Error submitting complaint:', err, `at ${new Date().toLocaleString()}`);
        this.errorMessage = `Failed to submit complaint: ${err.statusText || err.message || 'Server not reachable.'}`;
      }
    });
  }

  filteredStadiums(): any[] {
    const filtered = this.stadiums.filter(s =>
      s.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log('Filtered stadiums:', filtered, `at ${new Date().toLocaleString()}`);
    return filtered;
  }
}