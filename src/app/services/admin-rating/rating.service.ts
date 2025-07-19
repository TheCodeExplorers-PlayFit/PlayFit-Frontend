// services/admin-rating/rating.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rating {
  id: number;
  user_id: number;
  entity_type: 'stadium' | 'coach';
  entity_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_email: string;
  entity_name: string;
  entity_details: string;
}

export interface RatingStatistics {
  overall: {
    total_ratings: number;
    average_rating: number;
    min_rating: number;
    max_rating: number;
  };
  distribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  byEntityType: Array<{
    entity_type: string;
    total_ratings: number;
    average_rating: number;
  }>;
  topStadiums: Array<{
    id: number;
    name: string;
    rating_count: number;
    average_rating: number;
  }>;
  topCoaches: Array<{
    id: number;
    name: string;
    rating_count: number;
    average_rating: number;
  }>;
}

export interface RatingResponse {
  success: boolean;
  data: Rating[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EntityRatingResponse {
  success: boolean;
  data: {
    ratings: Rating[];
    statistics: {
      total_ratings: number;
      average_rating: number;
      min_rating: number;
      max_rating: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly apiUrl = 'http://localhost:5000/api/admin/ratings';

  constructor(private http: HttpClient) {}

  // Get all ratings with pagination, search, and filters
  getAllRatings(params: {
    page?: number;
    limit?: number;
    search?: string;
    entityType?: 'stadium' | 'coach' | '';
  } = {}): Observable<RatingResponse> {
    let httpParams = new HttpParams();
    
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.entityType) httpParams = httpParams.set('entityType', params.entityType);

    return this.http.get<RatingResponse>(this.apiUrl, { params: httpParams });
  }

  // Get rating statistics
  getRatingStatistics(): Observable<{ success: boolean; data: RatingStatistics }> {
    return this.http.get<{ success: boolean; data: RatingStatistics }>(`${this.apiUrl}/statistics`);
  }

  // Get ratings for specific entity
  getEntityRatings(entityType: 'stadium' | 'coach', entityId: number): Observable<EntityRatingResponse> {
    return this.http.get<EntityRatingResponse>(`${this.apiUrl}/${entityType}/${entityId}`);
  }

  // Delete a rating
  deleteRating(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  // Helper method to get star display
  getStarDisplay(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  }

  // Helper method to get rating color class
  getRatingColorClass(rating: number): string {
    if (rating >= 4.5) return 'rating-excellent';
    if (rating >= 3.5) return 'rating-good';
    if (rating >= 2.5) return 'rating-average';
    if (rating >= 1.5) return 'rating-poor';
    return 'rating-very-poor';
  }
}