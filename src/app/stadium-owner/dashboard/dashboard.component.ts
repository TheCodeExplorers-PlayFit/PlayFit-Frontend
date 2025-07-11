import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  marginLeft = '5px';
  marginTop = '78px';
  
  cards = [
    {
      subtitle: 'Add a Stadium',
      text: 'Start managing your venues by adding your stadium details',
      backgroundColor: '#F3A4A4',
      route: '/stadium-owner/add-stadium'
    },
    {
      subtitle: 'Set up Player Packages',
      text: 'Create packages or pricing for players',
      backgroundColor: '#C0C0DE',
      route: '/stadium-owner/player-packages'
    },
    {
      subtitle: 'Review Complaints',
      text: 'Track and resolve complaints for better management.',
      backgroundColor: '#CFEDC6',
      route: '/stadium-owner/maintenance-requests'
    },
    {
      subtitle: 'Explore Analytics',
      text: 'View data and performance insights for your stadiums.',
      backgroundColor: '#F9C8F1',
      route: '/stadium-owner/waitlist'
    }
  ];
}