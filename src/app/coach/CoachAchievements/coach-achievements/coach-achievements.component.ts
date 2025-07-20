import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoachAchievementService } from '../../../services/coach-achivements/coach-achievement.service';
@Component({
  selector: 'app-coach-achievements',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './coach-achievements.component.html',
})
export class CoachAchievementsComponent implements OnInit {
  myAchievements: any[] = [];
  allAchievements: any[] = [];
  topAchievers: any[] = [];
  coachId = 18; // Replace with dynamic retrieval, e.g., from AuthService

  constructor(private achievementService: CoachAchievementService) {}

  ngOnInit(): void {
    this.fetchMyAchievements();
    this.fetchAllAchievements();
    this.fetchTopAchievers();
  }

  fetchMyAchievements(): void {
    this.achievementService.getMyAchievements(this.coachId).subscribe({
      next: (data: any) => {
        this.myAchievements = data;
      },
      error: (err:any) => {
        console.error('Error fetching my achievements:', err);
      }
    });
  }

  fetchAllAchievements(): void {
    this.achievementService.getAllAchievements().subscribe({
      next: (data: any) => {
        this.allAchievements = data;
      },
      error: (err:any) => {
        console.error('Error fetching all achievements:', err);
      }
    });
  }

  fetchTopAchievers(): void {
    this.achievementService.getTopAchievements().subscribe({
      next: (data: any) => {
        this.topAchievers = data;
      },
      error: (err:any) => {
        console.error('Error fetching top achievers:', err);
      }
    });
  }
}