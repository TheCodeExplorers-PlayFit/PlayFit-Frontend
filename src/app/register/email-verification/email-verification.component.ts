import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent {
  verificationCode: string = '';
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  commonData: any = {};

  constructor(private router: Router, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras.state?.['email'] || '';

    // Load commonData from localStorage (saved in previous step)
    const storedCommonData = localStorage.getItem('commonData');
    if (storedCommonData) {
      this.commonData = JSON.parse(storedCommonData);
    } else {
      // If no data found, redirect back to common form (optional)
      this.router.navigate(['/sign-in-form-common']);
    }
  }

  verifyCode(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.verificationCode) {
      this.errorMessage = 'Please enter the verification code';
      return;
    }

    // Get verification code saved in localStorage from common form
    const storedCode = localStorage.getItem('verificationCode');

    if (this.verificationCode === storedCode) {
      // Success: clear stored verification code (optional)
      localStorage.removeItem('verificationCode');

      this.successMessage = 'Email verified successfully! Redirecting...';

      // Redirect to role-specific form, passing commonData in state
      const role = this.commonData.role;
      switch (role) {
        case 'player':
          this.router.navigate(['/sign-in-form'], { state: { commonData: this.commonData } });
          break;
        case 'coach':
          this.router.navigate(['/sign-in-form-coach'], { state: { commonData: this.commonData } });
          break;
        case 'stadiumOwner':
          this.router.navigate(['/sign-in-form-stadium-owner'], { state: { commonData: this.commonData } });
          break;
        case 'medicalOfficer':
          this.router.navigate(['/sign-in-form-medical-officer'], { state: { commonData: this.commonData } });
          break;
        default:
          this.router.navigate(['/role-selection']);
      }
    } else {
      this.errorMessage = 'Invalid verification code';
    }
  }
}
