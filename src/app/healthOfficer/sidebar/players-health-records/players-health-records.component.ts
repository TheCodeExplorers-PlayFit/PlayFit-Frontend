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
          this.selectedPlayer = this.filteredAppointments[0];
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

    // Auto-select first if exists
    if (this.filteredAppointments.length > 0) {
      this.selectedPlayer = this.filteredAppointments[0];
    } else {
      this.selectedPlayer = null;
    }
  }

  selectPlayer(player: any) {
    this.selectedPlayer = player;
  }

  goToAddInjury(appointmentId: number) {
    this.router.navigate([`/health/record-injuries/${appointmentId}`]);
  }
}
