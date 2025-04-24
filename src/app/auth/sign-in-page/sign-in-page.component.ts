import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
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
          console.log('Received role:', response.user.role); // Debug role
          const role = response.user.role;
          switch (role) {
            case 'coach':
              console.log('Redirecting to coach dashboard');
              this.router.navigate(['/coach/dashboard']);
              break;
            case 'medicalOfficer':
              console.log('Redirecting to medical officer dashboard');
              this.router.navigate(['/health/dashboard']);
              break;
            case 'stadiumOwner':
              console.log('Redirecting to stadium owner dashboard');
              this.router.navigate(['/stadium-owner/dashboard']);
              break;
            case 'player':
              console.log('Redirecting to player dashboard');
              this.router.navigate(['/player/dashboard']);
              break;
            case 'admin':
              console.log('Redirecting to admin dashboard');
              this.router.navigate(['/admin/dashboard']);
              break;
            default:
              console.error('Unknown role:', role);
              this.errorMessage = 'Unknown role';
              this.router.navigate(['/home']);
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