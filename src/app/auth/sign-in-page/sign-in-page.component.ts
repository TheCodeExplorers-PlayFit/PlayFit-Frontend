import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.css'],
})
export class SignInPageComponent {
  loginData = {
    email: '',
    password: '',
    rememberMe: false,
  };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = null;
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        if (response.success) {
          // Redirect based on user role
          const userRole = response.user.role;
          if (userRole === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (userRole === 'player') {
            this.router.navigate(['/player/dashboard']);
          } else if (userRole === 'coach') {
            this.router.navigate(['/coach/dashboard']);
          } else if (userRole === 'stadiumOwner') {
            this.router.navigate(['/stadium-owner/dashboard']);
          } else if (userRole === 'medicalOfficer') {
            this.router.navigate(['/health/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'An error occurred during login. Please check your credentials and try again.';
      },
    });
  }
}