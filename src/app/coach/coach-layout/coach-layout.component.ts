import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coach-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './coach-layout.component.html',
  styleUrls: ['./coach-layout.component.css']
})
export class CoachLayoutComponent {
  isCoach: boolean = false;

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    console.log('CoachLayout user:', user); // Debug
    this.isCoach = user?.role === 'coach';
    if (!this.isCoach) {
      console.warn('Not a coach role:', user?.role || 'undefined');
    }
  }
}