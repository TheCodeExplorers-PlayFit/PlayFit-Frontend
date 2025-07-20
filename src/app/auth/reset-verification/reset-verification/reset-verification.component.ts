import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reset-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './reset-verification.component.html',
  styleUrls: ['./reset-verification.component.css']
})
export class ResetVerificationComponent {
  verificationCode: string = '';
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    this.email = navigation?.extras.state?.['email'] || '';
  }

  verifyResetCode(): void {
    if (!this.verificationCode) {
      this.errorMessage = 'Please enter the verification code';
      return;
    }

    this.http
      .post('http://localhost:5000/api/users/verify-reset-code', {
        email: this.email,
        resetCode: this.verificationCode
      })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.successMessage = response.message;
            this.errorMessage = '';
            this.router.navigate(['/reset-password'], { state: { email: this.email } });
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to verify code';
        }
      });
  }
}