import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Import sidebars for different roles
import { SidebarComponent as AdminSidebar } from "./Admin/sidebar/sidebar.component";
import { SidebarComponent as StadiumOwnerSidebar } from "./stadium-owner/stadium-owner-sidebar/stadium-owner-sidebar.component";
import { SidebarComponent as HealthOfficerSidebar } from "./healthOfficer/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdminSidebar, StadiumOwnerSidebar, HealthOfficerSidebar,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sports-Management-System';

  // Check if the user is registered (logged in)
  ifRegistered: boolean = true; // Set this based on your authentication logic

  // User's role, this can be dynamically set based on the logged-in user
  currentRole: string = 'stadium-owner'; // Example: 'admin', 'stadium-owner', 'healthOfficer'

  // Dynamically select the sidebar component based on the user's role
  get sidebarComponent() {
    if (this.ifRegistered) {
      switch (this.currentRole) {
        case 'admin':
          return AdminSidebar;
        case 'stadium-owner':
          return StadiumOwnerSidebar;
        case 'healthOfficer':
          return HealthOfficerSidebar;
        default:
          return null;
      }
    }
    return null; // Return null if user is not registered
  }
}

