import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { PlayerSidebarComponent } from '../player-sidebar/player-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-layout',
  standalone: true,
  imports: [RouterOutlet, PlayerSidebarComponent,CommonModule],
  templateUrl: './player-layout.component.html',
  styleUrls: ['./player-layout.component.css']
})
export class PlayerLayoutComponent {
  isPlayer: boolean = false;

  constructor(private authService: AuthService) {
    const user = this.authService.getUser();
    console.log('PlayerLayout user:', user); // Debug
    this.isPlayer = user?.role === 'player';
    if (!this.isPlayer) {
      console.warn('Not a player role:', user?.role || 'undefined');
    }
  }
}