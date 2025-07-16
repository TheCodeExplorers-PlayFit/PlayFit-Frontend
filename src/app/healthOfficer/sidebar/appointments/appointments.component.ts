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
  public tableHeader: string = '#E0E0EE';
  private appointmentService = inject(AppointmentService);
  appointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;

  ngOnInit(): void {
    const healthOfficerId = 2; // Replace with dynamic ID as needed
    this.appointmentService.getAppointmentsByHealthOfficer(healthOfficerId).subscribe((data: Appointment[]) => {
      this.appointments = data;
    });
  }

  onRowClick(appointment: Appointment): void {
    this.selectedAppointment = appointment;
  }

  onStatusChange(event: Event, appointment: Appointment): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    if (newStatus) {
      this.updateStatus(appointment, newStatus);
    }
  }

  updateStatus(appointment: Appointment, newStatus: string): void {
    if (!newStatus) return;
  
    this.appointmentService.updateAppointmentStatus(appointment.id, newStatus).subscribe(response => {
      appointment.status = response.data.status;  // update the local list
      console.log(`Updated appointment ${appointment.id} to: ${response.data.status}`);
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'text-success';  // Bootstrap green
      case 'Rejected':
        return 'text-danger';   // Bootstrap red
      case 'Pending':
        return 'text-warning';  // Bootstrap yellow
      default:
        return '';
    }
  }
}