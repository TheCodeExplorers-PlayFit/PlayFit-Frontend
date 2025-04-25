import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; // Import RouterModule
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SidebarComponent as AdminSidebar } from "./Admin/sidebar/sidebar.component";
import { SidebarComponent as StadiumOwnerSidebar } from "./stadium-owner/sidebar/sidebar.component";
import { SidebarComponent as HealthOfficerSidebar } from "./healthOfficer/sidebar/sidebar.component";
import { CoachSidebarComponent } from './coach/coach-sidebar/coach-sidebar.component';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './services/auth/auth.service'; // Import AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule, // Add RouterModule to provide routing services
    NavBarComponent,
    AdminSidebar,
    StadiumOwnerSidebar,
    HealthOfficerSidebar,
    
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Sports-Management-System';
  ifRegistered: boolean = false; // Initialize as false
  currentRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.ifRegistered = this.authService.isLoggedIn();
    const user = this.authService.getUser();
    this.currentRole = user ? user.role : null;
    console.log('ifRegistered:', this.ifRegistered);
    console.log('currentRole:', this.currentRole);
    console.log('sidebarComponent:', this.sidebarComponent);
  }

  get sidebarComponent() {
    if (this.ifRegistered) {
      switch (this.currentRole) {
        case 'admin':
          return AdminSidebar;
        case 'stadium-owner':
          return StadiumOwnerSidebar;
        case 'healthOfficer':
          return HealthOfficerSidebar;
        case 'coach':
          return CoachSidebarComponent; // Add coach sidebar
        default:
          return null;
      }
    }
    return null;
  }
}