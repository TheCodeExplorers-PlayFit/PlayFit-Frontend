import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { StadiumOwnerSidebarComponent } from '../stadium-owner-sidebar/stadium-owner-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stadium-owner-layout',
  standalone: true,
  imports: [RouterOutlet, StadiumOwnerSidebarComponent, CommonModule],
  templateUrl: './stadium-owner-layout.component.html',
  styleUrls: ['./stadium-owner-layout.component.css']
})
export class StadiumOwnerLayoutComponent {
  isStadiumOwner: boolean = false;

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    console.log('StadiumOwnerLayout user:', JSON.stringify(user, null, 2)); 
    this.isStadiumOwner = user?.role === 'stadiumOwner'; 
    if (!this.isStadiumOwner) {
      console.warn('Not a stadium-owner role:', user?.role || 'undefined');
    }
  }
}