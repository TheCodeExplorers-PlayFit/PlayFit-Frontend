import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsService } from '../../services/achievements/achievements.service';
import { Achievement } from '../../models/achievement';

interface Card {
  subtitle: string;
  value: number | string;
  backgroundColor: string;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.css'
})
export class AchievementsComponent implements OnInit {
  bgcolor1: string = '#F3A4A4';
  bgcolor2: string = '#C0C0DE';
  bgcolor3: string = '#CFEDC6';
  bgcolor4: string = '#F9C8F1';
  primarycolor: string = '#000080';
  buttongreen: string = '#76de1b63';
  marginLeft = '5px';
  marginTop = '78px';

  cards: Card[] = [];

  constructor(private achievementsService: AchievementsService) {}

  ngOnInit() {
    this.achievementsService.getAchievements().subscribe({
      next: (data: Achievement) => {
        console.log('Received data:', data);
        this.cards = [
          { subtitle: 'Total Achievements Unlocked', value: data.totalUnlocked, backgroundColor: this.bgcolor1 },
          { subtitle: 'Top Achiever of the Month', value: data.topAchiever, backgroundColor: this.bgcolor2 },
          { subtitle: 'Most Active Module', value: data.mostActiveModule, backgroundColor: this.bgcolor3 },
          { subtitle: 'Most Recent Achievement', value: data.mostRecent, backgroundColor: this.bgcolor4 }
        ];
      },
      error: (err) => console.error('Subscription error:', err)
    });
  }
}