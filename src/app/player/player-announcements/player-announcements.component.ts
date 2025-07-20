import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-announcements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-announcements.component.html',
  styleUrls: ['./player-announcements.component.css']
})
export class PlayerAnnouncementsComponent implements OnInit {
  announcements: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAnnouncements();
  }

  fetchAnnouncements(): void {
    this.http.get<{ success: boolean; announcements: any[] }>('http://localhost:5000/api/player-announcements')
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.announcements = res.announcements;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Failed to load announcements';
          }
        },
        error: (err) => {
          this.errorMessage = 'Error fetching announcements: ' + err.message;
          console.error(err);
        }
      });
  }
}
