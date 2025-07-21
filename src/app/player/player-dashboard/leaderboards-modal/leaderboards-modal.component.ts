import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-leaderboards-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './leaderboards-modal.component.html',
  styleUrls: ['./leaderboards-modal.component.css']
})
export class LeaderboardsModalComponent implements OnInit {
  private apiURL = 'http://localhost:5000/api/player-leaderboards';
  leaderboards: any[] = [];
  filteredLeaderboards: any[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient, private dialogRef: MatDialogRef<LeaderboardsModalComponent>) {}

  ngOnInit(): void {
    this.fetchLeaderboards();
  }

  fetchLeaderboards(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    this.http.get(`${this.apiURL}/leaderboards`, { headers }).subscribe({
      next: (response: any) => {
        this.leaderboards = response.leaderboards;
        this.filteredLeaderboards = this.leaderboards;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching leaderboards:', error);
        this.isLoading = false;
      }
    });
  }

  searchLeaderboards(): void {
    if (!this.searchQuery.trim()) {
      this.filteredLeaderboards = this.leaderboards;
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredLeaderboards = this.leaderboards.filter(
      entry =>
        entry.player_name.toLowerCase().includes(query) ||
        entry.stadium_name.toLowerCase().includes(query)
    );
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}