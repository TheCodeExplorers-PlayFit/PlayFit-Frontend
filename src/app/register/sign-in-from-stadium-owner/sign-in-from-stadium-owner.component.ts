import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sign-in-from-stadium-owner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in-from-stadium-owner.component.html',
  styleUrls: ['./sign-in-from-stadium-owner.component.css']
})
export class SignInFromStadiumOwnerComponent implements OnInit {
  userData: any = {
    mobileNumber: '',
    nic: '',
    gender: '',
    facilityName: '',
    facilityAddress: '',
    role: 'stadiumOwner'
  };
  commonData: any = {};
  errorMessage: string = '';
  termsAccepted: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Use history.state to get data passed from the common form
    const state = history.state;
    console.log('State received in stadium owner form:', state);

    if (state && state.commonData) {
      this.commonData = state.commonData;
      console.log('Common data received:', this.commonData);
    } else {
      console.error('No common data found, redirecting back');
      this.router.navigate(['/sign-in-form-common']);
    }
  }

  onSubmit() {
    console.log('Submit button clicked');

    // Check if all required fields are filled
    if (!this.userData.mobileNumber || !this.userData.nic || !this.userData.gender || 
        !this.userData.facilityName || !this.userData.facilityAddress) {
      this.errorMessage = 'Please fill in all required fields';
      console.error('Form validation failed:', this.errorMessage);
      return;
    }

    if (!this.termsAccepted) {
      this.errorMessage = 'Please accept the terms and conditions';
      console.error('Terms not accepted');
      return;
    }

    // Combine common data with stadium owner-specific data
    const completeUserData = {
      ...this.commonData,
      ...this.userData
    };

    console.log('Submitting complete user data:', completeUserData);

    this.authService.register(completeUserData).subscribe({
      next: (response) => {
        console.log('Registration successful!', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}