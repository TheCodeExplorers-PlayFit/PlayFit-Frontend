import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Status = 'Pending' | 'Approved' | 'Declined';

interface BlogRequest {
  id: string;
  position: string;
  name: string;
  date: string;
  time: string;
  blogTitle: string;
  status: Status;
  photo: string;
}

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {
  blogRequests: BlogRequest[] = [
    {
      id: 'P001',
      position: 'player',
      name: 'Nolan Bator',
      date: '01/10/2025',
      time: '09:00 AM',
      blogTitle: 'Injury Follow-up',
      status: 'Pending',
      photo: 'https://randomuser.me/api/portraits/men/30.jpg'
    },
    {
      id: 'P002',
      position: 'player',
      name: 'Nathan Diett',
      date: '01/10/2025',
      time: '10:00 AM',
      blogTitle: 'Vaccination & Immunization',
      status: 'Pending',
      photo: 'https://randomuser.me/api/portraits/men/31.jpg'
    },
    {
      id: 'P003',
      position: 'coach',
      name: 'Erin Levin',
      date: '01/10/2025',
      time: '11:00 AM',
      blogTitle: 'Preventive Health Check',
      status: 'Approved',
      photo: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    {
      id: 'P004',
      position: 'player',
      name: 'Chance Rosser',
      date: '01/10/2025',
      time: '11:15 AM',
      blogTitle: 'Fitness Assessment',
      status: 'Declined',
      photo: 'https://randomuser.me/api/portraits/men/33.jpg'
    }
  ];

  changeStatus(blog: BlogRequest, status: Status) {
    blog.status = status;
  }
}
