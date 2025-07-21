import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RatingsPopupComponent } from 'app/coach/coach-ratings-popup/ratings-popup/ratings-popup.component';
@Component({
  selector: 'app-stadium-ratings',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatDialogModule],
  templateUrl: './stadium-ratings.component.html',
  styleUrls: ['./stadium-ratings.component.css']
})
export class StadiumRatingsForCoachComponent implements OnInit, OnDestroy {
  stadiumSearchQuery = '';
  stadiums: any[] = [];
  recentStadiumRatings: any[] = [];

  private stadiumSearchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  private readonly apiBase = 'http://localhost:5000/api/coach-sessions';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.searchSubscription = this.stadiumSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => this.fetchStadiums(query));

    this.fetchRecentStadiumRatings();
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  onStadiumSearchChange(query: string): void {
    this.stadiumSearchSubject.next(query.trim());
  }

  private fetchStadiums(query: string): void {
    if (!query) {
      this.stadiums = [];
      return;
    }
    this.http.get<{ success: boolean; data: any[] }>(`${this.apiBase}/search?query=${encodeURIComponent(query)}`)
      .subscribe({
        next: res => {
          if (res.success) {
            this.stadiums = res.data;
          } else {
            this.stadiums = [];
          }
        },
        error: _err => {
          this.stadiums = [];
        }
      });
  }

  private fetchRecentStadiumRatings(): void {
    this.http.get<{ success: boolean; data: any[] }>(`${this.apiBase}/recent?limit=5`)
      .subscribe({
        next: res => {
          if (res.success) {
            this.recentStadiumRatings = res.data;
          } else {
            this.recentStadiumRatings = [];
          }
        },
        error: _err => {
          this.recentStadiumRatings = [];
        }
      });
  }

  openRatingPopup(stadium: any): void {
    const dialogRef = this.dialog.open(RatingsPopupComponent, {
      width: '400px',
      data: { entityId: stadium.id, entityName: stadium.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh recent ratings after successful submission
        this.fetchRecentStadiumRatings();
      }
    });
  }
}