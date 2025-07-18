import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachAnnouncementService, Notice } from '../../services/CoachAnnouncement/coach-announcement.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-coach-announcement',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './coach-announcement.component.html',
  styleUrls: ['./coach-announcement.component.css']
})
export class CoachAnnouncementComponent implements OnInit {
  allNotices: Notice[] = [];
  coachNotices: Notice[] = [];

  constructor(private announcementService: CoachAnnouncementService) {}

  ngOnInit(): void {
    this.announcementService.getAllNotices().subscribe((data: Notice[]) => this.allNotices = data);
    this.announcementService.getCoachNotices().subscribe((data: Notice[]) => this.coachNotices = data);
  }
}
