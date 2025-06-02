import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StadiumService } from '../../services/stadium/stadium.service';
import { AuthService } from '../../services/auth/auth.service';
import { BookingService } from '../../services/booking/booking.service';

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
  selectedStadium: any = null; // For popup

  constructor(
    private stadiumService: StadiumService,
    private authService: AuthService,
    private bookingService: BookingService,
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
        console.log('API Response:', response); // Debug log
        if (response.success && response.data) {
          this.stadiums = response.data.map((stadium: any) => {
            console.log(`Raw images for ${stadium.name}:`, stadium.images); // Log raw images field
            const parsedImages = this.parseImages(stadium.images);
            console.log(`Parsed images for ${stadium.name}:`, parsedImages); // Log parsed images
            return {
              ...stadium,
              images: parsedImages
            };
          });
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

  viewDetails(stadium: any): void {
    this.selectedStadium = stadium; // Show popup
  }

  closePopup(): void {
    this.selectedStadium = null; // Hide popup
  }

  bookStadium(stadium: any): void {
    this.router.navigate(['/coach/coach-stadium-timetable', stadium.id]); // Use absolute path
    this.closePopup(); // Close the popup after navigation
  }

  // Helper method to parse images field
  private parseImages(images: any): string[] {
    if (!images) {
      console.log('Images field is null or undefined');
      return [];
    }
    if (Array.isArray(images)) {
      console.log('Images field is already an array:', images);
      return images;
    }
    if (typeof images === 'string') {
      try {
        // Try parsing as JSON
        const parsed = JSON.parse(images);
        console.log('Images parsed as JSON:', parsed);
        return Array.isArray(parsed) ? parsed : [images];
      } catch {
        // If not JSON, treat as comma-separated string or single image
        console.log('Images treated as string:', images);
        return images.includes(',') ? images.split(',').map(img => img.trim()) : [images];
      }
    }
    console.log('Images field in unexpected format:', images);
    return [];
  }
}