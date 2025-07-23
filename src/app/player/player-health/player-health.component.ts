// player-health.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-player-health',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
  ],
  templateUrl: './player-health.component.html',
  styleUrls: ['./player-health.component.css'],
})
export class PlayerHealthComponent implements OnInit {
  private apiUrl = 'http://localhost:5000/api/player';
  appointments: any[] = [];
  displayedColumns: string[] = [
    'appointment_date',
    'appointment_time',
    'health_officer_name',
    'reason',
    'status',
  ];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    const playerId = this.authService.getPlayerId();
    if (playerId) {
      const token = localStorage.getItem('token');
      this.http.get(`${this.apiUrl}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      }).subscribe({
        next: (response: any) => {
          this.appointments = response.appointments;
        },
        error: (error) => {
          console.error('Error fetching appointments:', error);
        },
      });
    }
  }

  openAppointmentDialog(): void {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '600px',
      data: { playerId: this.authService.getPlayerId() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAppointments(); // Refresh appointments after creating a new one
      }
    });
  }
}

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Make an Appointment</h2>
    <mat-dialog-content>
      <mat-form-field style="width: 100%;">
        <mat-label>Search Health Officer</mat-label>
        <input
          matInput
          [(ngModel)]="searchQuery"
          (input)="searchHealthOfficers()"
          placeholder="Enter health officer name"
        />
      </mat-form-field>
      <mat-form-field style="width: 100%;">
        <mat-label>Select Health Officer</mat-label>
        <mat-select [(ngModel)]="appointment.health_officer_id" required>
          <mat-option *ngFor="let officer of healthOfficers" [value]="officer.id">
            {{ officer.name }} {{ officer.isVerified ? '(Verified)' : '' }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field style="width: 100%;">
        <mat-label>Appointment Date</mat-label>
        <input
          matInput
          [matDatepicker]="picker"
          [(ngModel)]="appointment.appointment_date"
          required
        />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
      <mat-form-field style="width: 100%;">
        <mat-label>Appointment Time</mat-label>
        <input
          matInput
          type="time"
          [(ngModel)]="appointment.appointment_time"
          required
        />
      </mat-form-field>
      <mat-form-field style="width: 100%;">
        <mat-label>Reason</mat-label>
        <textarea
          matInput
          [(ngModel)]="appointment.reason"
          placeholder="Describe the reason for the appointment"
        ></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()">Submit</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-form-field {
        margin-bottom: 15px;
      }
      mat-dialog-actions {
        justify-content: flex-end;
        gap: 10px;
      }
    `,
  ],
})
export class AppointmentDialogComponent {
  searchQuery: string = '';
  healthOfficers: any[] = [];
  appointment: any = {
    health_officer_id: null,
    appointment_date: null,
    appointment_time: null,
    reason: '',
  };
  private apiUrl = 'http://localhost:5000/api/player';

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialog,
    private authService: AuthService
  ) {
    this.searchHealthOfficers();
  }

  searchHealthOfficers(): void {
    const token = localStorage.getItem('token');
    this.http
      .get(`${this.apiUrl}/health-officers`, {
        params: { name: this.searchQuery },
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (response: any) => {
          this.healthOfficers = response.healthOfficers;
        },
        error: (error) => {
          console.error('Error fetching health officers:', error);
        },
      });
  }

  onSubmit(): void {
    if (
      this.appointment.health_officer_id &&
      this.appointment.appointment_date &&
      this.appointment.appointment_time
    ) {
      const formattedDate = new Date(this.appointment.appointment_date)
        .toISOString()
        .split('T')[0];
      const payload = {
        ...this.appointment,
        appointment_date: formattedDate,
      };
      const token = localStorage.getItem('token');
      this.http.post(`${this.apiUrl}/appointments`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      }).subscribe({
        next: (response: any) => {
          this.dialogRef.closeAll();
        },
        error: (error) => {
          console.error('Error creating appointment:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.closeAll();
  }
}