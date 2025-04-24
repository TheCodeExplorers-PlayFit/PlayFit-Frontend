import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  ratingsBreakdown = [
    { stars: 5, count: 102 },
    { stars: 4, count: 70 },
    { stars: 3, count: 25 },
    { stars: 2, count: 15 },
    { stars: 1, count: 10 },
  ];

  topCoaches = [
    { name: 'Nolan Bator', photo: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { name: 'Ruben Gold', photo: 'https://randomuser.me/api/portraits/men/20.jpg' },
    { name: 'Erin Levin', photo: 'https://randomuser.me/api/portraits/women/32.jpg' },
    { name: 'Chance Rosser', photo: 'https://randomuser.me/api/portraits/men/33.jpg' }
  ];
}
