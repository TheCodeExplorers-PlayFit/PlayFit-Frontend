import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { HealthOfficerSidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-health-officer-layout',
  standalone: true,
  imports: [RouterOutlet, HealthOfficerSidebarComponent, CommonModule],
  templateUrl: './health-officer-layout.component.html',
  styleUrls: ['./health-officer-layout.component.css']
})
export class HealthOfficerLayoutComponent {
  isHealthOfficer: boolean = false;

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    console.log('HealthOfficerLayout user:', user); // Debug: Log user object
    if (user) {
      console.log('User role:', user.role); // Debug: Log role specifically
      this.isHealthOfficer = user.role === 'healthOfficer' || user.role === 'medicalOfficer'; // Check both possible role names
    }
    if (!this.isHealthOfficer) {
      console.warn('Not a health officer role:', user?.role || 'undefined');
    }
  }
}