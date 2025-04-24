import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalSports: 0,
    totalStadiums: 0
  };

  recentActions: string[] = [
    'User "Player One" registered as player',
    'Sport "Cricket" added',
    'Stadium "Colombo Arena" updated'
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Mock data for stats (replace with actual API calls)
    this.stats = {
      totalUsers: 20,
      totalSports: 5,
      totalStadiums: 3
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }
}