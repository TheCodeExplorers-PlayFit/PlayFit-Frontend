import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  requestResetCode(): void {
    if (!this.email) {
      this.errorMessage = 'Please enter your email';
      return;
    }

    if (!this.email.includes('@')) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.http
      .post('http://localhost:5000/api/users/forgot-password', { email: this.email })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.successMessage = response.message;
            this.errorMessage = '';
            // Send verification email using EmailJS
            const templateParams = {
              to_email: this.email,
              verification_code: response.resetCode,
              name: response.user.firstName
            };

            emailjs
              .send('service_3f8csjl', 'template_smgvofa', templateParams, 'BMcMCkD_jjDt2AEKb')
              .then((res) => {
                console.log('Reset email sent successfully:', res.status, res.text);
                this.router.navigate(['/reset-verification'], { state: { email: this.email } });
              })
              .catch((err) => {
                console.error('Failed to send reset email:', err);
                this.errorMessage = 'Failed to send verification email: ' + (err.text || 'Unknown error');
              });
          } else {
            this.errorMessage = response.message || 'Failed to process request';
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to process request';
        }
      });
  }
}