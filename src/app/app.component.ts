import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Import sidebars for different roles
import { SidebarComponent as StadiumOwnerSidebar } from "./stadium-owner/sidebar/sidebar.component";
import { SidebarComponent as HealthOfficerSidebar } from "./healthOfficer/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StadiumOwnerSidebar, HealthOfficerSidebar],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sports-Management-System';

  // Check if the user is registered (logged in)
  ifRegistered: boolean = true; // Set this based on your authentication logic

  // User's role, this can be dynamically set based on the logged-in user
  currentRole: string = 'stadium-owner'; // Example: 'stadium-owner' or 'healthOfficer'

  // Dynamically select the sidebar component based on the user's role
  get sidebarComponent() {
    if (this.ifRegistered) {
      if (this.currentRole === 'stadium-owner') {
        return StadiumOwnerSidebar;
      } else if (this.currentRole === 'healthOfficer') {
        return HealthOfficerSidebar;
      }
    }
    return null; // Return null if user is not registered
  }
}
