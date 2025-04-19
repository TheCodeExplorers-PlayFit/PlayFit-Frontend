import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Navigation bar component for the application.
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive]
})
export class NavBarComponent {
  /**
   * Handles the search icon click event.
   */
  onSearchClick(): void {
    console.log('Search icon clicked');
  }

  /**
   * Handles the notification icon click event.
   */
  onNotificationClick(): void {
    console.log('Notification icon clicked');
  }
}