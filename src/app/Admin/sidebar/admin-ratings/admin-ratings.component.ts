// components/admin-ratings/admin-ratings.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { RatingService, Rating, RatingStatistics } from '../../../services/admin-rating/rating.service';

@Component({
  selector: 'app-admin-ratings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-ratings.component.html',
  styleUrls: ['./admin-ratings.component.css']
})
export class AdminRatingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Data properties
  ratings: Rating[] = [];
  statistics: RatingStatistics | null = null;
  loading = false;
  error: string | null = null;

  // Filter and pagination properties
  searchTerm = '';
  entityTypeFilter: 'stadium' | 'coach' | '' = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // UI state
  showStatistics = true;
  selectedRating: Rating | null = null;
  showDeleteConfirm = false;
  ratingToDelete: number | null = null;

  constructor(private ratingService: RatingService) {
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 1;
      this.loadRatings();
    });
  }

  ngOnInit(): void {
    this.loadRatings();
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Load ratings with current filters
  loadRatings(): void {
    this.loading = true;
    this.error = null;

    const params = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchTerm,
      entityType: this.entityTypeFilter
    };

    this.ratingService.getAllRatings(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.ratings = response.data;
            this.totalItems = response.pagination.total;
            this.totalPages = response.pagination.totalPages;
          } else {
            this.error = 'Failed to load ratings';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading ratings:', error);
          this.error = 'Error loading ratings. Please try again.';
          this.loading = false;
        }
      });
  }

  // Load statistics
  loadStatistics(): void {
    this.ratingService.getRatingStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.statistics = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading statistics:', error);
        }
      });
  }

  // Search functionality
  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  // Filter functionality
  onEntityTypeFilterChange(): void {
    this.currentPage = 1;
    this.loadRatings();
  }

  // Pagination
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadRatings();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.loadRatings();
  }

  // Rating actions
  viewRating(rating: Rating): void {
    this.selectedRating = rating;
  }

  closeRatingDetails(): void {
    this.selectedRating = null;
  }

  confirmDeleteRating(ratingId: number): void {
    this.ratingToDelete = ratingId;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.ratingToDelete = null;
    this.showDeleteConfirm = false;
  }

  deleteRating(): void {
    if (this.ratingToDelete) {
      this.ratingService.deleteRating(this.ratingToDelete)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.loadRatings();
              this.loadStatistics();
              this.cancelDelete();
            }
          },
          error: (error) => {
            console.error('Error deleting rating:', error);
            this.error = 'Error deleting rating. Please try again.';
          }
        });
    }
  }

  // Utility methods
  getStarDisplay(rating: number): string {
    return this.ratingService.getStarDisplay(rating);
  }

  getRatingColorClass(rating: number): string {
    return this.ratingService.getRatingColorClass(rating);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEntityTypeIcon(entityType: string): string {
    return entityType === 'stadium' ? '🏟️' : '👨‍🏫';
  }

  getPaginationArray(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Statistics helpers
  getStatisticPercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  toggleStatistics(): void {
    this.showStatistics = !this.showStatistics;
  }

  // Export functionality (optional)
  exportRatings(): void {
    // Implement CSV export if needed
    console.log('Export functionality to be implemented');
  }

  // Refresh data
  refreshData(): void {
    this.loadRatings();
    this.loadStatistics();
  }

  // Track by function for ngFor performance
  trackByRatingId(index: number, rating: Rating): number {
    return rating.id;
  }

  // Helper method for pagination display
  getMaxDisplayItems(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }
}