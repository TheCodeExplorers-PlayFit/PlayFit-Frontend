import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MaintenanceRequestsService } from '../../services/maintenance-requests/maintenance-requests.service';
import { Complaint, Card } from '@models/maintenance-requests';

@Component({
  selector: 'app-maintenance-requests',
  templateUrl: './maintenance-requests.component.html',
  styleUrls: ['./maintenance-requests.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MaintenanceRequestsComponent implements OnInit {
  complaints: Complaint[] = [];
  totalTasks = 0;
  pendingTasks = 0;
  completedTasks = 0;
  inProgressTasks = 0;

  cards: Card[] = [
    { subtitle: 'Total Tasks', text: this.totalTasks.toString(), backgroundColor: '#F3A4A4', route: '/stadium-owner/maintenance-requests' },
    { subtitle: 'Pending Tasks', text: this.pendingTasks.toString(), backgroundColor: '#C0C0DE', route: '/stadium-owner/maintenance-requests' },
    { subtitle: 'Completed Tasks', text: this.completedTasks.toString(), backgroundColor: '#CFEDC6', route: '/stadium-owner/maintenance-requests' },
    { subtitle: 'In Progress', text: this.inProgressTasks.toString(), backgroundColor: '#F9C8F1', route: '/stadium-owner/maintenance-requests' }
  ];

  constructor(
    private maintenanceRequestsService: MaintenanceRequestsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    console.log('MaintenanceRequestsComponent initialized');
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.fetchComplaints();
  }

  fetchComplaints() {
    console.log('fetchComplaints called');
    this.maintenanceRequestsService.getMaintenanceRequests().subscribe({
      next: (data) => {
        this.complaints = data || [];
        console.log('Fetched complaints:', this.complaints);
        this.totalTasks = this.complaints.length;
        this.pendingTasks = this.complaints.filter(c => c.status === 'pending').length;
        this.completedTasks = this.complaints.filter(c => c.status === 'resolved').length;
        this.inProgressTasks = this.complaints.filter(c => c.status === 'in_progress').length;
        this.updateCardText();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching complaints:', error);
        if (error.message.includes('401')) {
          this.router.navigate(['/login']);
        }
        alert(error.message);
      }
    });
  }

  updateCardText() {
    this.cards[0].text = this.totalTasks.toString();
    this.cards[1].text = this.pendingTasks.toString();
    this.cards[2].text = this.completedTasks.toString();
    this.cards[3].text = this.inProgressTasks.toString();
  }

  viewRequest(id: number) {
    console.log('View request:', id);
    this.router.navigate([`/stadium-owner/maintenance-requests/${id}`]);
  }

  editRequest(complaint: Complaint) {
    console.log('Edit request:', complaint.id);
    const newStatus = complaint.status === 'pending' ? 'resolved' : 'pending';
    this.maintenanceRequestsService.updateMaintenanceRequest(complaint.id, newStatus).subscribe({
      next: () => {
        complaint.status = newStatus;
        this.pendingTasks = this.complaints.filter(c => c.status === 'pending').length;
        this.completedTasks = this.complaints.filter(c => c.status === 'resolved').length;
        this.inProgressTasks = this.complaints.filter(c => c.status === 'in_progress').length;
        this.updateCardText();
        this.cdr.detectChanges();
        alert('Maintenance request status updated successfully!');
      },
      error: (error) => {
        console.error('Error updating request:', error);
        if (error.message.includes('401')) {
          this.router.navigate(['/login']);
        }
        alert(error.message);
      }
    });
  }

  viewAllRequests() {
    console.log('View all requests called');
    this.fetchComplaints();
  }
}