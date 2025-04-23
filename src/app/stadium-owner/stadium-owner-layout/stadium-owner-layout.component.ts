import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { SidebarComponent } from '../stadium-owner-sidebar/stadium-owner-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stadium-owner-layout',
  imports: [RouterOutlet, SidebarComponent,CommonModule],
  templateUrl: './stadium-owner-layout.component.html',
  styleUrl: './stadium-owner-layout.component.css'
})
export class StadiumOwnerLayoutComponent {
  isStadiumOwner: boolean = false;

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    console.log('PlayerLayout user:', user); // Debug
    this.isStadiumOwner = user?.role === 'player';
    if (!this.isStadiumOwner) {
      console.warn('Not a player role:', user?.role || 'undefined');
    }
  }
}
