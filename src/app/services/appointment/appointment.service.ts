import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Appointment {
  id: number;
  player_id: number;
  player_name: string;
  health_officer_id: number;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  action: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api'; // Change if needed

  // GET /api/healthofficers/:id/appointments
  getAppointmentsByHealthOfficer(id: number): Observable<Appointment[]> {
    return this.http.get<{ success: boolean, data: Appointment[] }>(`${this.baseUrl}/appointments/${id}`)
      .pipe(
        map(res => res.data)
      );
  }
  
  // POST /api/appointments (optional, for creating)
  createAppointment(data: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments`, data);
  }

  updateAppointmentStatus(id: number, status: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/appointments/update-status`, {
      healthAppointmentId: id,
      status: status
    });
  }
  

}
