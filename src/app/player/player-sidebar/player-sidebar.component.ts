import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-player-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './player-sidebar.component.html',
  styleUrl: './player-sidebar.component.css'
})
export class PlayerSidebarComponent {

}
