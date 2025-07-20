import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.css']
})
export class SignInFormComponent implements OnInit {
  healthIssues: string = 'no';
  healthIssuesDescription: string = '';
  userData: any = {
    mobileNumber: '',
    age: null,
    gender: '',
    nic: '',
    role: 'player'
  };
  commonData: any = {};
  errorMessage: string = '';
  termsAccepted: boolean = false;
  isValidNIC: boolean = true;
  showNICError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Use history.state instead of navigation extras
    const state = history.state;
    console.log('State received in player form:', state);

    if (state && state.commonData) {
      this.commonData = state.commonData;
      console.log('Common data received:', this.commonData);
    } else {
      console.error('No common data found, redirecting back');
      // Redirect back to common form if no data is passed
      this.router.navigate(['/sign-in-form-common']);
    }
  }

  toggleHealthIssues(value: string) {
    this.healthIssues = value;
    console.log('Health issues toggled:', value);
  }

  validateNIC(nic: string): boolean {
    const oldNICPattern = /^\d{9}[vVxX]$/;  // e.g., 911234567V
    const newNICPattern = /^\d{12}$/;       // e.g., 199812345678

    return oldNICPattern.test(nic) || newNICPattern.test(nic);
  }


  onSubmit() {
    console.log('Submit button clicked');

    // Check if all required fields are filled
    if (!this.userData.mobileNumber || !this.userData.age || !this.userData.gender || !this.userData.nic) {
      this.errorMessage = 'Please fill in all required fields';
      console.error('Form validation failed:', this.errorMessage);
      return;
    }

    // NIC Validation
    this.isValidNIC = this.validateNIC(this.userData.nic);
    if (!this.isValidNIC) {
      this.errorMessage = '';
      this.showNICError = true;
      return;
    } else {
      this.showNICError = false;
    }

    //terms acception checker
    if (!this.termsAccepted) {
      this.errorMessage = 'Please accept the terms and conditions';
      console.error('Terms not accepted');
      return;
    }

    // Combine common data with player-specific data
    const completeUserData = {
      ...this.commonData,
      ...this.userData,
      hasHealthIssues: this.healthIssues === 'yes',
      healthIssuesDescription: this.healthIssues === 'yes' ? this.healthIssuesDescription : ''
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