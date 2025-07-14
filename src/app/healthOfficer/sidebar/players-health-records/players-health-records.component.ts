// players-health-records.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-players-health-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players-health-records.component.html',
  styleUrl: './players-health-records.component.css'
})
export class PlayersHealthRecordsComponent implements OnInit {
  marginTop = '60px';
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  selectedPlayer: any = null;
  searchTerm: string = '';
  injuries: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    this.http.get<any>('http://localhost:5000/api/appointments/2/with-user-details').subscribe({
      next: (res) => {
        if (res.success) {
          this.appointments = res.data;
          this.filteredAppointments = [...this.appointments];
          if (this.filteredAppointments.length > 0) {
            this.selectPlayer(this.filteredAppointments[0]);
          }
        }
      },
      error: (err) => console.error('Failed to fetch appointments', err)
    });
  }

  filterPlayers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredAppointments = this.appointments.filter(p =>
      `${p.first_name} ${p.last_name}`.toLowerCase().startsWith(term)
    );

    if (this.filteredAppointments.length > 0) {
      this.selectPlayer(this.filteredAppointments[0]);
    } else {
      this.selectedPlayer = null;
      this.injuries = [];
    }
  }

  selectPlayer(player: any) {
    this.selectedPlayer = player;
    this.fetchInjuriesByPlayerId(player.player_id); // Important: use `player_id` not `id`
  }

  fetchInjuriesByPlayerId(playerId: number) {
    this.http.get<any>(`http://localhost:5000/api/injuries/player/${playerId}`).subscribe({
      next: (res) => {
        if (res.success) {
          this.injuries = res.data;
        } else {
          this.injuries = [];
        }
      },
      error: (err) => {
        console.error('Failed to fetch injuries', err);
        this.injuries = [];
      }
    });
  }

  goToAddInjury(appointmentId: number) {
    this.router.navigate([`/health/record-injuries/${appointmentId}`]);
  }
}
