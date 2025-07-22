import { Component,OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HealthTipsService } from '../services/healthtips/health-tips.service';
import { CommonModule } from '@angular/common';

/**
 * Navigation bar component for the application.
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule]
})
export class NavBarComponent implements OnInit {
   publicTips: any[] = [];
  selectedCategory: string = '';

  constructor(private healthTipsService: HealthTipsService) {}

  ngOnInit() {
    this.loadHealthTips();
  }

   loadHealthTips() {
    this.healthTipsService.getAllPublicHealthTips().subscribe((res) => {
      if (res.success) {
        this.publicTips = res.data;
      }
    });
  }

   get filteredTips() {
    if (!this.selectedCategory) return this.publicTips.slice(0, 6);
    return this.publicTips
      .filter(tip => tip.category === this.selectedCategory)
      .slice(0, 6);
  }

  
  setCategory(category: string) {
    this.selectedCategory = category;
  }

  /**
   * Handles the search icon click event.
   */
  onSearchClick(): void {
    console.log('Search icon clicked');
  }

  /**
   * Handles the notification icon click event.
   */
  onNotificationClick(): void {
    console.log('Notification icon clicked');
  }
}