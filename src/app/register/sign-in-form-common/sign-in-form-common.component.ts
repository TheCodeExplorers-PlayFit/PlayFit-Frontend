import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in-form-common',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './sign-in-form-common.component.html',
  styleUrl: './sign-in-form-common.component.css'
})
export class SignInFormCommonComponent {
  marginTop = '72px';
  role: string | null = null;
  userData: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };
  termsAccepted: boolean = false;
  
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.role = navigation?.extras.state?.['role'] as string;
    
    // For debugging - log the role
    console.log('Role received:', this.role);
  }
  
  goToRoleSpecificForm(): void {
    // Form validation
    if (!this.userData.firstName || !this.userData.lastName || !this.userData.email || !this.userData.password) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!this.termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    if (!this.userData.email || !this.userData.email.includes('@')) {
  alert('Please enter a valid email address with @');
  return;
   }
    
    // Debug log to verify data being passed
    console.log('Navigating with data:', this.userData);
    console.log('Role for navigation:', this.role);
    
    if (this.role) {
      switch (this.role) {
        case 'player':
          this.router.navigate(['/sign-in-form'], {
            state: { commonData: this.userData }
          });
          break;
        case 'coach':
          this.router.navigate(['/sign-in-form-coach'], {
            state: { commonData: this.userData }
          });
          break;
        case 'stadiumOwner':
          this.router.navigate(['/sign-in-form-stadium-owner'], {
            state: { commonData: this.userData }
          });
          break;
        case 'medicalOfficer':
          this.router.navigate(['/sign-in-form-medical-officer'], {
            state: { commonData: this.userData }
          });
          break;
        default:
          this.router.navigate(['/role-selection']);
      }
    } else {
      console.error('No role selected, redirecting to role selection');
      this.router.navigate(['/role-selection']);
    }
  }
}