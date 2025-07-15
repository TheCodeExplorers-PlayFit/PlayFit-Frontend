import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SportsModalComponent } from './sports-modal/sports-modal.component';
import { LocationsModalComponent } from './locations-modal/locations-modal.component';
import { StadiumsModalComponent } from './stadiums-modal/stadiums-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, SportsModalComponent, LocationsModalComponent, StadiumsModalComponent],
  templateUrl: './player-dashboard.component.html',
  styleUrls: ['./player-dashboard.component.css']
})
export class PlayerDashboardComponent implements OnInit {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {}

  openSportsModal(): void {
    this.http.get(`${this.apiUrl}/users/sports`).subscribe({
      next: (response: any) => {
        const sports = response.sports;
        const dialogRef = this.dialog.open(SportsModalComponent, {
          width: '600px',
          data: { sports }
        });

        dialogRef.afterClosed().subscribe(selectedSport => {
          if (selectedSport) {
            this.openLocationsModal(selectedSport);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching sports:', error);
      }
    });
  }

  openLocationsModal(selectedSport: any): void {
    this.http.get(`${this.apiUrl}/sessions/locations`).subscribe({
      next: (response: any) => {
        const locations = response.locations;
        const dialogRef = this.dialog.open(LocationsModalComponent, {
          width: '600px',
          data: { locations }
        });

        dialogRef.afterClosed().subscribe(selectedLocation => {
          if (selectedLocation) {
            this.openStadiumsModal(selectedSport.id, selectedLocation.location_id);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching locations:', error);
      }
    });
  }

  openStadiumsModal(sportId: number, locationId: number): void {
    this.http.get(`${this.apiUrl}/sessions/stadiums`, {
      params: { sportId: sportId.toString(), locationId: locationId.toString() }
    }).subscribe({
      next: (response: any) => {
        const stadiums = response.stadiums;
        this.dialog.open(StadiumsModalComponent, {
          width: '600px',
          data: { stadiums, sportId, locationId }
        });
      },
      error: (error) => {
        console.error('Error fetching stadiums:', error);
      }
    });
  }

  exploreNearestStadium(): void {
    this.http.get(`${this.apiUrl}/sessions/locations`).subscribe({
      next: (response: any) => {
        const locations = response.locations;
        const dialogRef = this.dialog.open(LocationsModalComponent, {
          width: '600px',
          data: { locations }
        });

        dialogRef.afterClosed().subscribe(selectedLocation => {
          if (selectedLocation) {
            this.http.get(`${this.apiUrl}/sessions/stadiums-by-location`, {
              params: { locationId: selectedLocation.location_id.toString() }
            }).subscribe({
              next: (response: any) => {
                this.dialog.open(StadiumsModalComponent, {
                  width: '600px',
                  data: { stadiums: response.stadiums, locationId: selectedLocation.location_id }
                });
              },
              error: (error) => {
                console.error('Error fetching stadiums:', error);
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error fetching locations:', error);
      }
    });
  }

  fileComplaint(): void {
    this.router.navigate(['player/complaints']);
  }

  viewBookingHistory(): void {
    this.router.navigate(['player/booking-history']);
  }

  navigateToStadium(): void {
    this.router.navigate(['player/my-timetable']);
  }

  rateCoachesStadiums(): void {
    this.router.navigate(['player/ratings']);
  }
}