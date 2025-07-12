import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsService } from '../../services/achievements/achievements.service';
import { Achievement } from '../../models/achievement';
import { Subscription } from 'rxjs';

interface Card {
  subtitle: string;
  value: number | string;
  backgroundColor: string;
}

export interface ExtendedAchievement extends Achievement {
  stadiumName: string;
  dateEarned: string;
  userType: string;
  points: number;
  achievementName: string;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit, OnDestroy {
  bgcolor1: string = '#F3A4A4';
  bgcolor2: string = '#C0C0DE';
  bgcolor3: string = '#CFEDC6';
  bgcolor4: string = '#F9C8F1';
  primarycolor: string = '#000080';

  cards: Card[] = [];
  achievements: ExtendedAchievement[] = [];
  top3Achievers: ExtendedAchievement[] = [];

  private subscriptions: Subscription[] = [];

  constructor(@Inject(AchievementsService) private achievementsService: AchievementsService) {
    console.log('AchievementsComponent initialized');
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.subscriptions.push(
      this.achievementsService.getAchievements().subscribe({
        next: (data: Achievement) => {
          console.log('Received achievements:', data);
          this.cards = [
            { subtitle: 'Total Achievements Unlocked', value: data.totalUnlocked, backgroundColor: this.bgcolor1 },
            { subtitle: 'Top Achiever of the Month', value: data.topAchiever, backgroundColor: this.bgcolor2 },
            { subtitle: 'Most Active Module', value: data.mostActiveModule, backgroundColor: this.bgcolor3 },
            { subtitle: 'Most Recent Achievement', value: data.mostRecent, backgroundColor: this.bgcolor4 }
          ];
        },
        error: (err: any) => {
          console.error('Subscription error details:', err);
          this.cards = [{ subtitle: 'Error', value: 'Data fetch failed', backgroundColor: '#FF6347' }];
        },
        complete: () => console.log('Subscription complete')
      })
    );

    this.subscriptions.push(
      this.achievementsService.getAchievementDetails().subscribe({
        next: (data: any[]) => {
          console.log('Received achievement details:', data);
          this.achievements = data.map(item => ({
            totalUnlocked: 0, // Not from details; use getAchievements
            topAchiever: item.achievementName,
            mostActiveModule: 'N/A', // Fetch if available
            mostRecent: item.status,
            stadiumName: item.stadiumName || 'N/A',
            dateEarned: item.dateEarned || new Date().toISOString().split('T')[0],
            userType: item.userType || 'N/A',
            points: item.points || 0,
            achievementName: item.achievementName || 'N/A'
          }));
        },
        error: (err: any) => {
          console.error('Achievement details error:', err);
          this.achievements = [{ totalUnlocked: 0, topAchiever: 'N/A', mostActiveModule: 'N/A', mostRecent: 'N/A', stadiumName: 'N/A', dateEarned: '', userType: 'N/A', points: 0, achievementName: 'N/A' }];
        }
      })
    );

    this.subscriptions.push(
      this.achievementsService.getTop3Achievers().subscribe({
        next: (data: any[]) => {
          console.log('Received top 3 achievers:', data);
          this.top3Achievers = data.map(item => ({
            totalUnlocked: 0, // Not applicable here
            topAchiever: item.topAchiever,
            mostActiveModule: 'N/A',
            mostRecent: 'N/A',
            stadiumName: 'N/A', // Fetch if needed
            dateEarned: '', // Fetch if needed
            userType: item.userType,
            points: item.points,
            achievementName: item.topAchiever
          }));
        },
        error: (err: any) => {
          console.error('Top 3 achievers error:', err);
          this.top3Achievers = [];
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onEdit(achievement: ExtendedAchievement) {
    console.log('Edit clicked for:', achievement.achievementName);
    // Placeholder: Add navigation or form logic here
  }

  onView(achievement: ExtendedAchievement) {
    console.log('View clicked for:', achievement.achievementName);
    // Placeholder: Add navigation or detail display logic here
  }
}