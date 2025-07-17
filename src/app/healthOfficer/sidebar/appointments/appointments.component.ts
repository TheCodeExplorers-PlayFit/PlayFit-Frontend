import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../../../services/appointment/appointment.service';
import { AuthService } from '../../../services/auth/auth.service'; // ✅ Import AuthService

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
  private authService = inject(AuthService); // ✅ Inject AuthService

  appointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;

  ngOnInit(): void {
    const user = this.authService.getUser(); // ✅ Get logged-in user
    if (!user || !user.id) {
      alert('❌ Unable to fetch health officer ID.');
      return;
    }

    const healthOfficerId = user.id;
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
      appointment.status = response.data.status;
      console.log(`Updated appointment ${appointment.id} to: ${response.data.status}`);
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'text-success';
      case 'Rejected':
        return 'text-danger';
      case 'Pending':
        return 'text-warning';
      default:
        return '';
    }
  }
}
