import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CategoryType = 'Stadium' | 'Coach';

@Component({
  selector: 'app-feedback-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-rating.component.html',
  styleUrls: ['./feedback-rating.component.css']
})
export class FeedbackRatingComponent {
  selectedRating: number = 0;
  selectedCategory: CategoryType = 'Stadium';
  selectedTarget: string = '';
  feedbackText: string = '';

  categories: CategoryType[] = ['Stadium', 'Coach'];

  targets: Record<CategoryType, string[]> = {
    Stadium: ['PlayFit Arena', 'Unity Sports Complex'],
    Coach: ['Nolan Bator', 'Erin Levin']
  };

  submitRating() {
    const data = {
      type: this.selectedCategory,
      target: this.selectedTarget,
      rating: this.selectedRating,
      comment: this.feedbackText
    };

    console.log('Submitted rating:', data);
    alert('Thank you for your feedback!');
    //  can send this to a backend later
  }
}
