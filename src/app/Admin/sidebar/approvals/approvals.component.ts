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
  documentPath?: string;
}

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ApprovalsService], // Explicitly provide the service
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css']
})
export class ApprovalsComponent implements OnInit {
  filter: 'Peoples' | 'Stadiums' = 'Peoples';
  requests: ApprovalRequest[] = [];

  constructor(private approvalsService: ApprovalsService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.approvalsService.getUnverifiedUsers().subscribe({
      next: (data: any[]) => {
        this.requests = data.map((item: any) => ({
          id: item.userId,
          name: item.facilityName || `${item.first_name} ${item.last_name}`,
          role: item.role === 'medicalOfficer' ? 'Medical Officer' : item.role === 'coach' ? 'Coach' : 'Stadium',
          photo: 'https://randomuser.me/api/portraits/men/1.jpg', // Placeholder
          status: 'Pending' as Status,
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          documentPath: item.documentPath
        }));
      },
      error: (err: any) => console.error('Error fetching requests:', err)
    });
  }

  get filteredRequests(): ApprovalRequest[] {
    if (this.filter === 'Peoples') {
      return this.requests.filter((r) => r.role === 'Coach' || r.role === 'Medical Officer');
    } else {
      return this.requests.filter((r) => r.role === 'Stadium');
    }
  }

  approveRequest(request: ApprovalRequest): void {
    this.approvalsService.approveUser(request.id, request.role).subscribe({
      next: () => {
        this.requests = this.requests.filter((r) => r.id !== request.id);
      },
      error: (err: any) => console.error('Error approving request:', err)
    });
  }

  rejectRequest(request: ApprovalRequest): void {
    this.approvalsService.rejectUser(request.id, request.role).subscribe({
      next: () => {
        this.requests = this.requests.filter((r) => r.id !== request.id);
      },
      error: (err: any) => console.error('Error rejecting request:', err)
    });
  }
}