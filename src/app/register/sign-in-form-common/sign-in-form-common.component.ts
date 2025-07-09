import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-sign-in-form-common',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './sign-in-form-common.component.html',
  styleUrls: ['./sign-in-form-common.component.css']
})
export class SignInFormCommonComponent {
  marginTop = '72px';
  role: string | null = null;
  userData: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  };
  termsAccepted: boolean = false;

  constructor(private router: Router, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    this.role = navigation?.extras.state?.['role'] as string;
    this.userData.role = this.role;
    console.log('Role received:', this.role);
  }

  goToRoleSpecificForm(): void {
    // Form validation
    if (!this.userData.firstName || !this.userData.lastName || !this.userData.email || !this.userData.password || !this.userData.role) {
      alert('Please fill in all required fields: First Name, Last Name, Email, Password, and Role');
      return;
    }

    if (!this.termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    if (!this.userData.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    // Log the data being sent to backend
    console.log('Sending registration data:', this.userData);

    // Register user and get verification code
    this.http
      .post('http://localhost:5000/api/users/register', this.userData)
      .subscribe({
        next: (response: any) => {
          console.log('Registration response:', response);
          if (response.success) {
            // Send verification email using EmailJS
            const templateParams = {
              to_email: this.userData.email,
              verification_code: response.verificationCode
            };

            console.log('EmailJS template params:', templateParams);

            emailjs
              .send('service_3f8csjl', 'template_tjg0tid', templateParams, 'BMcMCkD_jjDt2AEKb')
              .then((res) => {
                console.log('Email sent successfully:', res.status, res.text);
                // Redirect to email verification page
                this.router.navigate(['/email-verification'], {
                  state: { email: this.userData.email, commonData: this.userData }
                });
              })
              .catch((err) => {
                console.error('Failed to send email:', err);
                alert('Failed to send verification email: ' + (err.text || 'Unknown error'));
              });
          } else {
            alert(response.message || 'Registration failed');
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          alert(error.error?.message || 'Failed to register user. Please try again.');
        }
      });
  }
}