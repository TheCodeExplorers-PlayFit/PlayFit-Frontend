import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-sign-in-form-coach',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './sign-in-form-coach.component.html',
  styleUrls: ['./sign-in-form-coach.component.css'] // Corrected to styleUrls
})
export class SignInFormCoachComponent {
  numberOfSports: number = 0; // Track the number of sports selected
  sportsFields: string[] = []; // Array to store selected sports

  // Method to update the sports fields based on the number of sports selected
  updateSportsFields() {
    this.sportsFields = Array(this.numberOfSports).fill('');
  }
}