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
    this.commonData = navigation?.extras.state?.['commonData'] || {};
  }

  verifyCode(): void {
    if (!this.verificationCode) {
      this.errorMessage = 'Please enter the verification code';
      return;
    }

    this.http
      .post('http://localhost:5000/api/users/verify-email', {
        email: this.email,
        verificationCode: this.verificationCode
      })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.successMessage = response.message;
            this.errorMessage = '';
            // Redirect to role-specific form
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
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Failed to verify code';
        }
      });
  }
}