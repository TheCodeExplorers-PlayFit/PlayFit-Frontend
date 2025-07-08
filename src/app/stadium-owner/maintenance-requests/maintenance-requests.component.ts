import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Complaint {
  id: number;
  reported_by: number;
  reported_to: string;
  stadium_id: number | null;
  coach_id: number | null;
  description: string;
  status: string;
  created_at: string;
}

interface Card {
  subtitle: string;
  text: string;
  backgroundColor: string;
  route: string;
}

@Component({
  selector: 'app-maintenance-requests',
  templateUrl: './maintenance-requests.component.html',
  styleUrls: ['./maintenance-requests.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class MaintenanceRequestsComponent implements OnInit {
  complaints: Complaint[] = [];
  totalTasks = 0;
  pendingTasks = 0;
  completedTasks = 0;
  inProgressTasks = 0;

  cards: Card[] = [
    { subtitle: 'Total Tasks', text: this.totalTasks.toString(), backgroundColor: '#F3A4A4', route: '/stadium-owner/maintenance-requests' },
    { subtitle: 'Pending Tasks', text: this.pendingTasks.toString(), backgroundColor: '#C0C0DE', route: '/stadium-owner/maintenance-requests' },
    { subtitle: 'Completed Tasks', text: this.completedTasks.toString(), backgroundColor: '#CFEDC6', route: '/stadium-owner/maintenance-requests' },
    { subtitle: 'In Progress', text: this.inProgressTasks.toString(), backgroundColor: '#F9C8F1', route: '/stadium-owner/maintenance-requests' }
  ];

  constructor(private http: HttpClient) {
    console.log('MaintenanceRequestsComponent initialized');
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.fetchComplaints();
  }

  fetchComplaints() {
    console.log('fetchComplaints called');
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    this.http.get<Complaint[]>('http://localhost:5000/api/stadium-owner/maintenance-requests', { headers }).subscribe({
      next: (data) => {
        this.complaints = data || [];
        console.log('Fetched complaints:', this.complaints);
        // Calculate dynamic counts
        this.totalTasks = this.complaints.length;
        this.pendingTasks = this.complaints.filter(c => c.status === 'pending').length;
        this.completedTasks = this.complaints.filter(c => c.status === 'resolved').length;
        this.inProgressTasks = 0; // No 'in_progress' status in the table
        this.updateCardText();
      },
      error: (error) => {
        console.error('Error fetching complaints:', error);
      }
    });
  }

  updateCardText() {
    this.cards[0].text = this.totalTasks.toString();
    this.cards[1].text = this.pendingTasks.toString();
    this.cards[2].text = this.completedTasks.toString();
    this.cards[3].text = this.inProgressTasks.toString();
  }

  getStadiumName(stadiumId: number | null): string {
    const stadiums = [
      { id: 1, name: 'YMB Sports Club' },
      { id: 2, name: 'Peak Performance Club' }
    ];
    const stadium = stadiumId ? stadiums.find(s => s.id === stadiumId) : null;
    return stadium ? stadium.name : 'Unknown';
  }

  getReportedByName(reportedById: number): string {
    const users = [
      { id: 18, username: 'player1' },
      { id: 19, username: 'player2' }
    ];
    const user = users.find(u => u.id === reportedById);
    return user ? user.username : 'Unknown';
  }
}