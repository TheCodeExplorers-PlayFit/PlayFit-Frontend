import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AchievementsService } from '../../services/achievements/achievements.service';
import { Achievement } from '../../models/achievement';
import { Subscription, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common'; // ⬅ Import this
import { NgFor, NgIf } from '@angular/common';

interface Card {
  subtitle: string;
  value: string | number;
  class: string;
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
  imports: [
  CommonModule, // ⬅ Add this
    // ...other components or modules you're using
  ],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit, OnDestroy {
 

  cards: Card[] = [];
  achievements: ExtendedAchievement[] = [];
  topAchieversByStadium: ExtendedAchievement[] = [];
  isLoading: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private achievementsService: AchievementsService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('AchievementsComponent initialized');
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.loadAllData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadAllData() {
    this.isLoading = true;
    
    // Use forkJoin to load all data simultaneously
    const dataLoaders$ = forkJoin({
      achievements: this.achievementsService.getAchievements(),
      achievementDetails: this.achievementsService.getAchievementDetails(),
      topAchievers: this.achievementsService.getTopAchieversByStadium()
    });

    this.subscriptions.push(
      dataLoaders$.subscribe({
        next: (data) => {
          console.log('All data received:', data);
          
          // Process achievements data for cards
          this.processAchievementsData(data.achievements);
          
          // Process achievement details for table
          this.processAchievementDetails(data.achievementDetails);
          
          // Process top achievers by stadium
          this.processTopAchievers(data.topAchievers);
          
          this.isLoading = false;
          this.cdr.detectChanges(); // Force change detection
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.handleError();
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      })
    );
  }

  private processAchievementsData(data: Achievement) {
    console.log('Processing achievements data:', data);
    
    if (data) {
     this.cards = [
      { subtitle: 'Total Achievements Unlocked', value: data.totalUnlocked || 0, class: 'card total' },
      { subtitle: 'Top Achiever of the Month', value: data.topAchiever || 'N/A', class: 'card active' },
      { subtitle: 'Most Active Module', value: data.mostActiveModule || 'N/A', class: 'card expired' },
      { subtitle: 'Most Recent Achievement', value: data.mostRecent || 'N/A', class: 'card popular' }
];

    } else {
      this.cards = [
        { subtitle: 'Error', value: 'No data available', class: '' }
      ];
    }
    
    console.log('Cards processed:', this.cards);
  }

  private processAchievementDetails(data: any[]) {
    console.log('Processing achievement details:', data);
    
    if (data && Array.isArray(data) && data.length > 0) {
      this.achievements = data.map(item => ({
        id: item.unique_id || item.id || 0,
        totalUnlocked: 0,
        topAchiever: item.topAchiever || item.first_name || 'N/A',
        mostActiveModule: 'N/A',
        mostRecent: 'N/A',
        stadiumName: item.stadiumName || 'N/A',
        dateEarned: this.formatDate(item.dateEarned),
        userType: item.userType || 'N/A',
        points: item.points || 0,
        achievementName: item.topAchiever || item.first_name || 'N/A',
        sessionsCount: item.sessionsCount || 0
      }));
    } else {
      console.warn('No achievement details received or invalid data format');
      this.achievements = [];
    }
    
    console.log('Achievements processed:', this.achievements);
  }

  private processTopAchievers(data: any[]) {
    console.log('Processing top achievers:', data);
    
    if (data && Array.isArray(data) && data.length > 0) {
      this.topAchieversByStadium = data.map(item => ({
        id: item.stadium_id || 0,
        totalUnlocked: 0,
        topAchiever: item.topAchiever || 'N/A', // This contains all achievers with same points
        mostActiveModule: 'N/A',
        mostRecent: 'N/A',
        stadiumName: item.stadiumName || 'N/A',
        dateEarned: '',
        userType: item.userType || 'N/A',
        points: item.points || 0,
        achievementName: item.topAchiever || 'N/A',
        sessionsCount: 0
      }));
    } else {
      console.warn('No top achievers data received');
      this.topAchieversByStadium = [];
    }
    
    console.log('Top achievers processed:', this.topAchieversByStadium);
  }

  private formatDate(dateInput: any): string {
    if (!dateInput) {
      return new Date().toISOString().split('T')[0];
    }
    
    if (dateInput instanceof Date) {
      return dateInput.toISOString().split('T')[0];
    }
    
    if (typeof dateInput === 'string') {
      // Handle various date string formats
      const date = new Date(dateInput);
      return isNaN(date.getTime()) ? 
        new Date().toISOString().split('T')[0] : 
        date.toISOString().split('T')[0];
    }
    
    return new Date().toISOString().split('T')[0];
  }

  private handleError() {
    this.cards = [
      { subtitle: 'Error', value: 'Failed to load data',class:'' }
    ];
    this.achievements = [];
    this.topAchieversByStadium = [];
  }

  // Method to refresh data
  refreshData() {
    this.loadAllData();
  }

  // Method to get display text for achievers (handles multiple achievers with same points)
  getAchieverDisplayText(achiever: ExtendedAchievement): string {
    return achiever.topAchiever;
  }
}