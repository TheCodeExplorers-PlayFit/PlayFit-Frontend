import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { StadiumService, Stadium } from '../../services/stadiums/stadium.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-stadium-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './stadium-list.component.html',
  styleUrls: ['./stadium-list.component.css']
})
export class StadiumListComponent implements OnInit {
  stadiums: Stadium[] = [];
  errorMessage: string | null = null;

  constructor(
    private stadiumService: StadiumService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    console.log('StadiumListComponent - User:', user);
    if (user && user.role === 'coach') {
      const sports = [user.sport1, user.sport2, user.sport3].filter(sport => sport != null && sport !== 0);
      console.log('Sports:', sports);
      if (sports.length === 0) {
        this.errorMessage = 'No valid sports selected for this coach';
        console.log('Error:', this.errorMessage);
        return;
      }
      this.stadiumService.getStadiums(sports).subscribe({
        next: (data) => {
          console.log('Stadiums data (raw):', data);
          this.stadiums = data.map(stadium => {
            let parsedImages = [];
            try {
              parsedImages = typeof stadium.images === 'string' ? JSON.parse(stadium.images) : stadium.images;
            } catch (error) {
              console.error(`Error parsing images for stadium ${stadium.id}:`, error);
              parsedImages = ['https://via.placeholder.com/300'];
            }
            return {
              ...stadium,
              images: Array.isArray(parsedImages) ? parsedImages : ['https://via.placeholder.com/300']
            };
          });
          console.log('Stadiums data (parsed):', this.stadiums);
        },
        error: (err) => {
          this.errorMessage = err.message;
          console.error('Error fetching stadiums:', err);
        }
      });
    } else {
      this.errorMessage = 'User is not a coach or not logged in';
      console.log('Error:', this.errorMessage);
    }
  }
}