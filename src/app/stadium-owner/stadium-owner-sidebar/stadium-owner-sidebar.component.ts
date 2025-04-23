import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './stadium-owner-sidebar.component.html',
  styleUrls: ['./stadium-owner-sidebar.component.css']
})
export class SidebarComponent {}