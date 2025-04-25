import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-coach-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './coach-sidebar.component.html',
  styleUrl: './coach-sidebar.component.css'
})
export class CoachSidebarComponent {

}
