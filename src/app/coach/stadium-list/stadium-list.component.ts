import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StadiumService } from '../../services/stadium/stadium.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-stadium-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './stadium-list.component.html',
  styleUrls: ['./stadium-list.component.css']
})
export class StadiumListComponent implements OnInit {
  stadiums: any[] = [];
  filteredStadiums: any[] = [];
  sports: string[] = [];
  locations: string[] = [];
  sportFilter: string = '';
  locationFilter: string = '';
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private stadiumService: StadiumService, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!this.authService.isLoggedIn() || !user) {
      this.error = 'Please log in to view available stadiums';
      this.loading = false;
      this.router.navigate(['/sign-in']);
      return;
    }
    if (user.role !== 'coach') {
      this.error = 'Only coaches can access this feature';
      this.loading = false;
      return;
    }
    this.loadStadiums();
  }

  loadStadiums(): void {
    this.loading = true;
    this.stadiumService.getStadiumsByCoachSports().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stadiums = response.data;
          this.filteredStadiums = [...this.stadiums];
          this.sports = [...new Set(
            this.stadiums
              .flatMap(stadium => stadium.sport_names || [])
              .filter(sport => sport)
          )];
          this.locations = [...new Set(
            this.stadiums
              .map(stadium => stadium.location_name)
              .filter(location => location)
          )];
        } else {
          this.stadiums = [];
          this.filteredStadiums = [];
          this.error = response.message || 'No stadiums found for your sports';
        }
        this.loading = false;
      },
      error: (error) => {
        if (error.status === 401) {
          this.error = 'Your session has expired. Please log in again.';
          if (error.error?.message.includes('Not authorized')) {
            this.authService.logout();
            this.router.navigate(['/sign-in']);
          }
        } else if (error.status === 403) {
          this.error = 'Only coaches can access this feature';
        } else if (error.status === 404) {
          this.error = error.error?.message || 'No valid sports found for this coach';
        } else {
          this.error = error.error?.message || 'Failed to load stadiums';
        }
        this.loading = false;
      }
    });
  }

  filterStadiums(): void {
    let tempStadiums = [...this.stadiums];

    if (this.sportFilter) {
      tempStadiums = tempStadiums.filter(stadium =>
        stadium.sport_names?.includes(this.sportFilter)
      );
    }

    if (this.locationFilter) {
      tempStadiums = tempStadiums.filter(stadium =>
        stadium.location_name?.toLowerCase().includes(this.locationFilter.toLowerCase())
      );
    }

    this.filteredStadiums = tempStadiums;
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/images/stadium-placeholder.jpg';
  }
}