// waitlist.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface WaitlistEntry {
  id: number;
  user_name: string;
  user_type: string;
  requested_date: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  status: string;
}

interface WaitlistStats {
  total_waitlist_requests: number;
  pending_requests: number;
  approved_requests: number;
  most_requested_slot: string | null;
}

@Component({
  selector: 'app-waitlist',
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class WaitlistComponent implements OnInit {
  waitlist: WaitlistEntry[] = [];
  waitlistStats: WaitlistStats = { total_waitlist_requests: 0, pending_requests: 0, approved_requests: 0, most_requested_slot: null };
  showAddWaitlistForm: boolean = false;
  newWaitlist: { user_id: number; session_id: number } = { user_id: 0, session_id: 0 };
  selectedWaitlistId: number | null = null;
  newStatus: string = 'approved';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchWaitlist();
    this.fetchWaitlistStats();
  }

  fetchWaitlist() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<WaitlistEntry[]>('http://localhost:5000/api/waitlist', { headers }).subscribe({
      next: (data) => this.waitlist = data,
      error: (error) => console.error('Error fetching waitlist:', error)
    });
  }

  fetchWaitlistStats() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<WaitlistStats>('http://localhost:5000/api/waitlist/stats', { headers }).subscribe({
      next: (data) => this.waitlistStats = data,
      error: (error) => console.error('Error fetching waitlist stats:', error)
    });
  }

  showAddWaitlist() {
    this.showAddWaitlistForm = true;
  }

  addToWaitlist() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.post('http://localhost:5000/api/waitlist/add', this.newWaitlist, { headers }).subscribe({
      next: () => {
        console.log('Added to waitlist');
        this.showAddWaitlistForm = false;
        this.newWaitlist = { user_id: 0, session_id: 0 };
        this.fetchWaitlist();
      },
      error: (error) => console.error('Error adding to waitlist:', error)
    });
  }

  cancelAddWaitlist() {
    this.showAddWaitlistForm = false;
    this.newWaitlist = { user_id: 0, session_id: 0 };
  }

  selectWaitlistForUpdate(id: number) {
    this.selectedWaitlistId = id;
    this.newStatus = this.waitlist.find(w => w.id === id)?.status || 'approved';
  }

  updateWaitlistStatus() {
    if (this.selectedWaitlistId === null) return;
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.put('http://localhost:5000/api/waitlist/status', { waitlist_id: this.selectedWaitlistId, status: this.newStatus }, { headers }).subscribe({
      next: () => {
        console.log('Waitlist status updated');
        this.selectedWaitlistId = null;
        this.fetchWaitlist();
      },
      error: (error) => console.error('Error updating waitlist status:', error)
    });
  }

  getDayOfWeek(day: number): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[day - 1] || 'Unknown';
  }
}