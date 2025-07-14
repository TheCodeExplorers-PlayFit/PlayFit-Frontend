import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-players-health-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './players-health-records.component.html',
  styleUrl: './players-health-records.component.css'
})
export class PlayersHealthRecordsComponent implements OnInit {
  appointments: any[] = [];
  selectedPlayer: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    this.http.get<any>('http://localhost:5000/api/appointments/2/with-user-details').subscribe({
      next: (res) => {
        if (res.success) {
          this.appointments = res.data;
          this.selectedPlayer = this.appointments[0]; // auto-select first
        }
      },
      error: (err) => console.error('Failed to fetch appointments', err)
    });
  }

  selectPlayer(player: any) {
    this.selectedPlayer = player;
  }

  goToAddInjury(appointmentId: number) {
    this.router.navigate([`/health/record-injuries/${appointmentId}`]);
  }
}
