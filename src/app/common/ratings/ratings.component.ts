import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RatingsPopupComponent } from './ratings-popup/ratings-popup.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit, OnDestroy {
  private baseUrl = 'http://localhost:5000/api/ratings';
  stadiumSearchQuery: string = '';
  coachSearchQuery: string = '';
  stadiums: any[] = [];
  coaches: any[] = [];
  recentStadiumRatings: any[] = [];
  recentCoachRatings: any[] = [];
  private stadiumSearchSubject = new Subject<string>();
  private coachSearchSubject = new Subject<string>();

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Debounce stadium search
    this.stadiumSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchStadiums(query);
    });

    // Debounce coach search
    this.coachSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchCoaches(query);
    });

    // Fetch recent ratings
    this.fetchRecentRatings();
  }

  ngOnDestroy(): void {
    this.stadiumSearchSubject.complete();
    this.coachSearchSubject.complete();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private fetchRecentRatings(): void {
    // Fetch recent stadium ratings (limit to 3)
    this.http.get(`${this.baseUrl}/stadium/0?limit=3`, { headers: this.getHeaders() })
      .subscribe({
        next: (response: any) => {
          console.log('Recent stadium ratings:', response);
          this.recentStadiumRatings = response.data || [];
        },
        error: (error) => {
          console.error('Error fetching recent stadium ratings:', error);
          this.recentStadiumRatings = [];
        }
      });

    // Fetch recent coach ratings (limit to 3)
    this.http.get(`${this.baseUrl}/coach/0?limit=3`, { headers: this.getHeaders() })
      .subscribe({
        next: (response: any) => {
          console.log('Recent coach ratings:', response);
          this.recentCoachRatings = response.data || [];
        },
        error: (error) => {
          console.error('Error fetching recent coach ratings:', error);
          this.recentCoachRatings = [];
        }
      });
  }

  onStadiumSearchChange(query: string): void {
    this.stadiumSearchSubject.next(query);
  }

  onCoachSearchChange(query: string): void {
    this.coachSearchSubject.next(query);
  }

  private searchStadiums(query: string): void {
    if (query.trim()) {
      console.log('Searching stadiums:', query);
      this.http.get(`${this.baseUrl}/stadiums/search?query=${encodeURIComponent(query)}`, { headers: this.getHeaders() })
        .subscribe({
          next: (response: any) => {
            console.log('Stadiums response:', response);
            this.stadiums = response.data || [];
          },
          error: (error) => {
            console.error('Error searching stadiums:', error);
            this.stadiums = [];
          }
        });
    } else {
      this.stadiums = [];
    }
  }

  private searchCoaches(query: string): void {
    if (query.trim()) {
      console.log('Searching coaches:', query);
      this.http.get(`${this.baseUrl}/coaches/search?query=${encodeURIComponent(query)}`, { headers: this.getHeaders() })
        .subscribe({
          next: (response: any) => {
            console.log('Coaches response:', response);
            this.coaches = response.data || [];
          },
          error: (error) => {
            console.error('Error searching coaches:', error);
            this.coaches = [];
          }
        });
    } else {
      this.coaches = [];
    }
  }

  openRatingsPopup(entityType: string, entityId: number, entityName: string): void {
    this.dialog.open(RatingsPopupComponent, {
      width: '600px',
      data: { entityType, entityId, entityName }
    });
  }
}