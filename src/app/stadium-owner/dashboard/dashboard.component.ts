
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StadiumOwnerAnnouncementService } from '../../services/stadium-owner-announcement/stadium-owner-announcement.service';
import { Notice } from '../../models/notice.model';

interface Card {
  subtitle: string;
  text: string;
  backgroundColor: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  marginLeft = '5px';
  marginTop = '78px';

  cards: Card[] = [
    {
      subtitle: 'Add a Stadium',
      text: 'Start managing your venues by adding your stadium details',
      backgroundColor: '#F3A4A4',
      route: '/stadium-owner/add-stadium'
    },
    {
      subtitle: 'Set up Player Packages',
      text: 'Create packages or pricing for players',
      backgroundColor: '#C0C0DE',
      route: '/stadium-owner/player-packages'
    },
    {
      subtitle: 'Review Complaints',
      text: 'Track and resolve complaints for better management.',
      backgroundColor: '#CFEDC6',
      route: '/stadium-owner/maintenance-requests'
    },
    {
      subtitle: 'Explore Analytics',
      text: 'View data and performance insights for your stadiums.',
      backgroundColor: '#F9C8F1',
      route: '/stadium-owner/waitlist'
    }
  ];

  notices: Notice[] = [];

  constructor(private announcementService: StadiumOwnerAnnouncementService) {}

  ngOnInit() {
    this.fetchNotices();
  }

  fetchNotices() {
    this.announcementService.getNotices().subscribe({
      next: (data) => {
        this.notices = data;
      },
      error: (error) => {
        console.error('Error fetching stadium owner announcements:', error);
      }
    });
  }

  trackByNoticeId(index: number, notice: Notice): number {
    return notice.id;
  }
}
