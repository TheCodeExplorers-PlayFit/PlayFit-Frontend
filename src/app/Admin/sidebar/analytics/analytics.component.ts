import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../../safe-url.pipe';

interface Achiever {
  name: string;
  achievements: number;
  points: number;
  userType: 'Player' | 'Coach';
  photo: string;
  medal: 'gold' | 'silver' | 'bronze';
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {
  metabaseEmbedUrl = 'https://your-metabase-instance.com/public/question/12345678-abcdef'; // Replace with real URL

  achievers: Achiever[] = [
    {
      name: 'Omar Aminoff',
      achievements: 23,
      points: 50,
      userType: 'Player',
      photo: 'https://randomuser.me/api/portraits/men/11.jpg',
      medal: 'gold'
    },
    {
      name: 'Marcus Curtis',
      achievements: 18,
      points: 30,
      userType: 'Coach',
      photo: 'https://randomuser.me/api/portraits/men/20.jpg',
      medal: 'silver'
    },
    {
      name: 'Sarah Leo',
      achievements: 15,
      points: 27,
      userType: 'Player',
      photo: 'https://randomuser.me/api/portraits/women/5.jpg',
      medal: 'bronze'
    }
  ];
}