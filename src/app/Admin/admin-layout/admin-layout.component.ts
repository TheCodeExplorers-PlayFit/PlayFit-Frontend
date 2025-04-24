import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AdminSidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminSidebarComponent, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    console.log('AdminLayout user:', user); // Debug
    this.isAdmin = user?.role === 'admin';
    if (!this.isAdmin) {
      console.warn('Not an admin role:', user?.role || 'undefined');
    }
  }
}