import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { StadiumService } from '../../services/stadium/stadium.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-stadium-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './stadium-list.component.html',
  styleUrl: './stadium-list.component.css'
})
export class StadiumListComponent implements OnInit {
  stadiums: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private stadiumService: StadiumService, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in before loading stadiums
    if (!this.authService.isLoggedIn()) {
      this.error = 'Please log in to view available stadiums';
      this.loading = false;
      
      // Optionally redirect to login page
      // this.router.navigate(['/login']);
      return;
    }

    // Continue loading stadiums if user is logged in
    this.loadStadiums();
  }

  loadStadiums(): void {
    this.loading = true;
    this.stadiumService.getStadiumsByCoachSports().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stadiums = response.data;
        } else {
          this.stadiums = [];
          this.error = 'No stadiums found for your sports';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching stadiums:', error);
        
        // Handle authentication errors
        if (error.status === 401) {
          this.error = 'Your session has expired. Please log in again.';
          this.authService.logout(); // Clear invalid token
          // Optionally redirect to login page
          // this.router.navigate(['/login']);
        } else {
          this.error = error.error?.message || 'Failed to load stadiums';
        }
        
        this.loading = false;
      }
    });
  }

  // Fallback image if stadium image can't be loaded
  handleImageError(event: any): void {
    event.target.src = 'assets/images/stadium-placeholder.jpg';
  }
}