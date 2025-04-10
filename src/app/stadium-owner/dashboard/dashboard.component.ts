import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  bgcolor1 : string = '#F3A4A4';
  bgcolor2 : string = '#C0C0DE';
  bgcolor3 : string = '#CFEDC6';
  bgcolor4 : string = '#F9C8F1';
  primarycolor : string = '#000080';
  buttongreen : string = '#76de1b63';
  marginLeft = '270px';
  marginTop = '78px';
  
cards= [
  {
   subtiitle : 'Add a Stadium',
   text: 'Start managing your venues by adding your stadium details',
   backgroundColor : '#F3A4A4',
  },
  {
    subtiitle : 'Set up Player Packages',
   text: 'Create packages or pricing for players',
   backgroundColor : '#C0C0DE'
  },
  {
    subtiitle : 'Review Complaints',
   text: 'Track and resolve complaints for better management.',
   backgroundColor : '#CFEDC6', 
  },
  {
    subtiitle : 'Explore Analytics',
   text: 'View data and performance insights for your stadiums.',
   backgroundColor : '#F9C8F1',
  },
]

  }

