import { Component, OnInit, OnDestroy } from '@angular/core';
import { AchievementsService } from '../../services/achievements/achievements.service';
import { Achievement } from '../../models/achievement';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Card {
  subtitle: string;
  value: string | number;
  backgroundColor: string;
}

export interface ExtendedAchievement extends Achievement {
  id: number;
  stadiumName: string;
  dateEarned: string;
  userType: string;
  points: number;
  achievementName: string;
  sessionsCount: number;
}

@Component({
  selector: 'app-achievements',
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
  topAchieversByStadium: ExtendedAchievement[] = [];
  editingAchievement: ExtendedAchievement | null = null;
  editForm: { [key: string]: number | string } = { points: 0, dateEarned: '' };

  private subscriptions: Subscription[] = [];

  constructor(private achievementsService: AchievementsService, private http: HttpClient) {
    console.log('AchievementsComponent initialized');
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.loadAllData();
    this.achievements.forEach(a => console.log('Achievement:', a));
    this.topAchieversByStadium.forEach(t => console.log('Top Achiever:', t));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadAllData() {
    this.subscriptions.push(
      this.achievementsService.getAchievements().subscribe({
        next: (data: Achievement) => {
          console.log('Received achievements:', data);
          this.cards = [
            { subtitle: 'Total Achievements Unlocked', value: data.totalUnlocked, backgroundColor: this.bgcolor1 },
            { subtitle: 'Top Achiever of the Month', value: data.topAchiever || 'N/A', backgroundColor: this.bgcolor2 },
            { subtitle: 'Most Active Module', value: data.mostActiveModule, backgroundColor: this.bgcolor3 },
            { subtitle: 'Most Recent Achievement', value: data.mostRecent, backgroundColor: this.bgcolor4 }
          ];
        },
        error: (err: any) => {
          console.error('Subscription error details:', err);
          this.cards = [{ subtitle: 'Error', value: 'Data fetch failed', backgroundColor: '#FF6347' }];
        }
      })
    );

    this.subscriptions.push(
      this.achievementsService.getAchievementDetails().subscribe({
        next: (data: any[]) => {
          console.log('Received achievement details:', data);
          this.achievements = data.map(item => ({
            id: item.unique_id || item.id,
            totalUnlocked: 0,
            topAchiever: item.topAchiever || item.first_name || 'N/A',
            mostActiveModule: 'N/A',
            mostRecent: 'N/A',
            stadiumName: item.stadiumName || 'N/A',
            dateEarned: item.dateEarned || new Date().toISOString().split('T')[0],
            userType: item.userType || 'N/A',
            points: item.points || 0,
            achievementName: item.topAchiever,
            sessionsCount: item.sessionsCount || 0
          }));
        },
        error: (err: any) => {
          console.error('Achievement details error:', err);
          this.achievements = [{ id: 0, totalUnlocked: 0, topAchiever: 'N/A', mostActiveModule: 'N/A', mostRecent: 'N/A', stadiumName: 'N/A', dateEarned: '', userType: 'N/A', points: 0, achievementName: 'N/A', sessionsCount: 0 }];
        }
      })
    );

    this.subscriptions.push(
      this.achievementsService.getTopAchieversByStadium().subscribe({
        next: (data: any[]) => {
          console.log('Received top achievers by stadium:', data);
          this.topAchieversByStadium = data.map(item => ({
            id: 0, // Unique ID not critical here, can be derived from index if needed
            totalUnlocked: 0,
            topAchiever: item.topAchiever,
            mostActiveModule: 'N/A',
            mostRecent: 'N/A',
            stadiumName: item.stadiumName,
            dateEarned: '',
            userType: item.userType,
            points: item.points,
            achievementName: item.topAchiever,
            sessionsCount: 0 // Placeholder, adjust if backend provides this
          }));
        },
        error: (err: any) => {
          console.error('Top achievers by stadium error:', err);
          this.topAchieversByStadium = [];
        }
      })
    );
  }

  startEdit(achievement: ExtendedAchievement) {
    this.editingAchievement = { ...achievement };
    this.editForm = {
      points: achievement.points,
      dateEarned: achievement.dateEarned
    };
  }

  saveEdit() {
    if (this.editingAchievement) {
      const url = `http://localhost:5000/api/achievement/${this.editingAchievement.id}`;
      this.http.put(url, this.editForm).subscribe({
        next: () => {
          console.log('Achievement updated');
          this.editingAchievement = null;
          this.loadAllData();
        },
        error: (err) => console.error('Update error:', err)
      });
    }
  }

  deleteAchievement(id: number) {
    const url = `http://localhost:5000/api/achievement/${id}`;
    this.http.delete(url).subscribe({
      next: () => {
        console.log('Achievement deleted');
        this.loadAllData();
      },
      error: (err) => console.error('Delete error:', err)
    });
  }

  onEdit(achievement: ExtendedAchievement) {
    this.startEdit(achievement);
  }

  onInputChange(field: string, event: any) {
    this.editForm[field] = event.target.value;
  }
}