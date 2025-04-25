import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApprovalsService } from '../../../services/approvals/approvals.service';

type Status = 'Pending' | 'Approved' | 'Rejected';

interface ApprovalRequest {
  id: number;
  name: string;
  role: string;
  photo: string;
  status: Status;
  createdAt: Date;
  documentPath: string;
}

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css']
})
export class ApprovalsComponent implements OnInit {
  requests: ApprovalRequest[] = [];

  constructor(private approvalsService: ApprovalsService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.approvalsService.getUnverifiedUsers().subscribe({
      next: (data) => {
        this.requests = data.map((user: any) => ({
          id: user.userId,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role === 'medicalOfficer' ? 'Medical Officer' : 'Coach',
          photo: 'https://randomuser.me/api/portraits/men/1.jpg', // Placeholder
          status: 'Pending' as Status,
          createdAt: new Date(user.created_at),
          documentPath: user.documentPath
        }));
      },
      error: (err) => console.error('Error fetching requests:', err)
    });
  }

  approveRequest(request: ApprovalRequest): void {
    this.approvalsService.approveUser(request.id, request.role).subscribe({
      next: () => {
        this.requests = this.requests.filter((r) => r.id !== request.id);
      },
      error: (err) => console.error('Error approving request:', err)
    });
  }

  rejectRequest(request: ApprovalRequest): void {
    this.approvalsService.rejectUser(request.id, request.role).subscribe({
      next: () => {
        this.requests = this.requests.filter((r) => r.id !== request.id);
      },
      error: (err) => console.error('Error rejecting request:', err)
    });
  }
}