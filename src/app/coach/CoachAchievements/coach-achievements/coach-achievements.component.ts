import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoachAchievementService } from '../../../services/coach-achivements/coach-achievement.service';
import { AuthService } from '../../../services/auth/auth.service';

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

  constructor(
    private achievementService: CoachAchievementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (user && user.role === 'coach') {
      this.fetchMyAchievements();
      this.fetchAllAchievements();
      this.fetchTopAchievers();
    } else {
      console.error('User is not logged in as a coach');
    }
  }

  fetchMyAchievements(): void {
    const user = this.authService.getUser();
    if (user && user.role === 'coach') {
      this.achievementService.getMyAchievements(user.id).subscribe({
        next: (data) => this.myAchievements = data,
        error: (err) => console.error('Error fetching my achievements:', err),
      });
    }
  }

  fetchAllAchievements(): void {
    this.achievementService.getAllAchievements().subscribe({
      next: (data) => this.allAchievements = data,
      error: (err) => console.error('Error fetching all achievements:', err),
    });
  }

  fetchTopAchievers(): void {
    this.achievementService.getTopAchievements().subscribe({
      next: (data) => this.topAchievers = data,
      error: (err) => console.error('Error fetching top achievers:', err),
    });
  }
}