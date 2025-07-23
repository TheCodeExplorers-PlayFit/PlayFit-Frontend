import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Appointment } from '../../../services/appointment/appointment.service';
import { AuthService } from '../../../services/auth/auth.service'; // ✅ Import AuthService
import Swal from 'sweetalert2';


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
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to change the status to "${newStatus}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateStatus(appointment, newStatus);
        Swal.fire({
          title: 'Success!',
          text: '✅ Status updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        // Reset the dropdown to its previous value
        selectElement.value = appointment.status;
      }
    });
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

  // Add these methods to your AppointmentsComponent class

/**
 * Generate initials from first name (and last name if available)
 */
getInitials(firstName: string, lastName?: string): string {
  if (!firstName) return '?';
  
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  
  return firstInitial + lastInitial;
}

/**
 * Get avatar color variant based on user name
 */
getAvatarVariant(name: string): string {
  if (!name) return '';
  
  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const variantNumber = Math.abs(hash) % 9 + 1;
  return `variant-${variantNumber}`;
}

/**
 * Generate random avatar colors (alternative approach)
 */
getRandomAvatarClass(): string {
  const variants = ['variant-1', 'variant-2', 'variant-3', 'variant-4', 'variant-5', 'variant-6', 'variant-7', 'variant-8', 'variant-9'];
  return variants[Math.floor(Math.random() * variants.length)];
}
}
