import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Status = 'Pending' | 'Approved' | 'Rejected';

interface ApprovalRequest {
  id: number;
  name: string;
  role: string;
  photo: string;
  status: Status;
  createdAt: Date;
}

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css']
})
export class ApprovalsComponent {
  filter: 'All' | 'Oldest' | 'Newest' = 'All';

  requests: ApprovalRequest[] = [
    {
      id: 1,
      name: 'Jacob Jones',
      role: 'Player',
      photo: 'https://randomuser.me/api/portraits/men/4.jpg',
      status: 'Pending',
      createdAt: new Date('2024-03-05')
    },
    {
      id: 2,
      name: 'Annette Black',
      role: 'Coach',
      photo: 'https://randomuser.me/api/portraits/women/5.jpg',
      status: 'Pending',
      createdAt: new Date('2024-03-10')
    },
    {
      id: 3,
      name: 'Jacob Jones',
      role: 'Stadium',
      photo: 'https://randomuser.me/api/portraits/men/6.jpg',
      status: 'Pending',
      createdAt: new Date('2024-03-08')
    },
    {
      id: 4,
      name: 'Cody Fisher',
      role: 'Medical Officer',
      photo: 'https://randomuser.me/api/portraits/women/7.jpg',
      status: 'Pending',
      createdAt: new Date('2024-03-09')
    }
  ];

  get filteredRequests(): ApprovalRequest[] {
    if (this.filter === 'Oldest') {
      return [...this.requests].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } else if (this.filter === 'Newest') {
      return [...this.requests].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return this.requests;
  }

  updateStatus(request: ApprovalRequest, status: Status) {
    request.status = status;
  }
}
