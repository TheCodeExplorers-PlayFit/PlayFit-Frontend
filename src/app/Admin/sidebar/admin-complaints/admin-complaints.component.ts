import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-complaints',
  templateUrl: './admin-complaints.component.html',
  styleUrls: ['./admin-complaints.component.css'],
  imports: [CommonModule]
})
export class AdminComplaintsComponent implements OnInit {
  coachComplaints: any[] = [];
  systemComplaints: any[] = [];
  error: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:5000/api/admin/complaints', { headers })
      .subscribe({
        next: (response: any) => {
          this.coachComplaints = response.data.coachComplaints;
          this.systemComplaints = response.data.systemComplaints;
        },
        error: (err) => {
          this.error = 'Error loading complaints: ' + err.message;
        }
      });
  }

  resolveComplaint(id: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.patch(`http://localhost:5000/api/admin/complaints/${id}/resolve`, {}, { headers })
      .subscribe({
        next: () => {
          // Update the complaint status in the UI
          const coachComplaint = this.coachComplaints.find(c => c.id === id);
          const systemComplaint = this.systemComplaints.find(c => c.id === id);
          if (coachComplaint) {
            coachComplaint.status = 'resolved';
          } else if (systemComplaint) {
            systemComplaint.status = 'resolved';
          }
        },
        error: (err) => {
          this.error = 'Error resolving complaint: ' + err.message;
        }
      });
  }
}