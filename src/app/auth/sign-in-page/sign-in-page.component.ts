import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [RouterModule, FormsModule,CommonModule],
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.css']
})
export class SignInPageComponent {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    console.log('Login attempt:', this.loginData);

    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        if (response.success && response.token) {
          const role = response.user.role;
          switch (role) {
            case 'coach':
              this.router.navigate(['/coach/dashboard']);
              break;
            case 'medicalOfficer':
              this.router.navigate(['/health/dashboard']);
              break;
            case 'stadiumOwner':
              this.router.navigate(['/stadium-owner/dashboard']);
              break;
            case 'player':
              this.router.navigate(['/player/dashboard']);
              break;
            case 'admin':
              this.router.navigate(['/admin/dashboard']);
              break;
            default:
              this.errorMessage = 'Unknown role';
              console.error('Unknown role:', role);
          }
        } else {
          this.errorMessage = 'Login failed: Invalid response';
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}