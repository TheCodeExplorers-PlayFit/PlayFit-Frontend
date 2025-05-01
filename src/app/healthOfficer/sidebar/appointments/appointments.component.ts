// File: src/app/healthOfficer/sidebar/appointments/appointments.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../../../services/appointment/appointment.service';


@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  marginTop = '72px';
  private appointmentService = inject(AppointmentService);
  appointments: Appointment[] = [];

  ngOnInit(): void {
    const healthOfficerId = 1; // Replace with dynamic ID as needed
    this.appointmentService.getAppointmentsByHealthOfficer(healthOfficerId).subscribe((data) => {
      this.appointments = data;
    });
  }
}
