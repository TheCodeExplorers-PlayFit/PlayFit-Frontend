import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApprovalsService } from '../../../services/approvals/approvals.service'; // Fixed import path

type Status = 'Pending' | 'Approved' | 'Rejected';//ustom type alias

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
  providers: [ApprovalsService],
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css']
})
export class ApprovalsComponent implements OnInit {
  filter: 'Peoples' | 'Stadiums' | 'Verified' = 'Peoples';
  unverifiedRequests: ApprovalRequest[] = [];
  verifiedRequests: ApprovalRequest[] = [];

  constructor(private approvalsService: ApprovalsService) {}

  ngOnInit(): void {
    this.loadUnverifiedRequests();
    this.loadVerifiedRequests();
  }

  loadUnverifiedRequests(): void {
    this.approvalsService.getUnverifiedUsers().subscribe({
      next: (data: any[]) => {
        this.unverifiedRequests = data.map((item: any) => ({
          id: item.userId,
          name: item.facilityName || `${item.first_name} ${item.last_name}`,
          role: item.role === 'medicalOfficer' ? 'Medical Officer' : item.role === 'coach' ? 'Coach' : 'Stadium',
          photo: item.role === 'stadium'
       ? 'https://th.bing.com/th?id=OIF.1w%2fVL%2fykHlIQu6UACxFPiA&rs=1&pid=ImgDetMain'
       : item.role === 'coach'
         ? 'https://randomuser.me/api/portraits/men/12.jpg'
         : 'https://randomuser.me/api/portraits/women/44.jpg',

          status: 'Pending' as Status,
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          documentPath: item.documentPath
        }));
      },
      error: (err: any) => {
        console.error('Error fetching unverified requests:', err);
        console.error('Error details:', err.message, err.status, err.statusText);
      }
    });
  }

  loadVerifiedRequests(): void {
    this.approvalsService.getVerifiedUsers().subscribe({
      next: (data: any[]) => {
        this.verifiedRequests = data.map((item: any) => ({
          id: item.userId,
          name: item.facilityName || `${item.first_name} ${item.last_name}`,
          role: item.role === 'medicalOfficer' ? 'Medical Officer' : item.role === 'coach' ? 'Coach' : 'Stadium',
          photo: 'https://randomuser.me/api/portraits/men/1.jpg',
          status: 'Approved' as Status,
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          documentPath: item.documentPath
        }));
      },
      error: (err: any) => {
        console.error('Error fetching verified requests:', err);
        console.error('Error details:', err.message, err.status, err.statusText);
      }
    });
  }

  get filteredRequests(): ApprovalRequest[] {
    if (this.filter === 'Peoples') {
      return this.unverifiedRequests.filter((r) => r.role === 'Coach' || r.role === 'Medical Officer');
    } else if (this.filter === 'Stadiums') {
      return this.unverifiedRequests.filter((r) => r.role === 'Stadium');
    } else {
      return this.verifiedRequests;
    }
  }

  approveRequest(request: ApprovalRequest): void {
    this.approvalsService.approveUser(request.id, request.role).subscribe({
      next: () => {
        this.unverifiedRequests = this.unverifiedRequests.filter((r) => r.id !== request.id);
        this.loadVerifiedRequests();
      },
      error: (err: any) => console.error('Error approving request:', err)
    });
  }

  rejectRequest(request: ApprovalRequest): void {
  const confirmed = window.confirm(`Are you sure you want to reject ${request.name}?`);

  if (!confirmed) return;

  this.approvalsService.rejectUser(request.id, request.role).subscribe({
    next: () => {
      this.unverifiedRequests = this.unverifiedRequests.filter((r) => r.id !== request.id);
    },
    error: (err: any) => console.error('Error rejecting request:', err)
  });
}

}