import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievements',
  imports: [CommonModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.css'
})


export class AchievementsComponent {
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
   subtiitle : 'Total Achievements Unlocked',
   value : 120,
   backgroundColor : '#F3A4A4',
  },
  {
    subtiitle : 'Top Achiever of the Month',
    value : 'Omar Aminoff',
   backgroundColor : '#C0C0DE', 
  },
  {
    subtiitle : 'Most Active Module',
    value : 'Player, Coach',
   backgroundColor : '#CFEDC6', 
  },
  {
    subtiitle : 'Most Recent Achievement',
    value : '100 Matches Played',
   backgroundColor : '#F9C8F1', 

  },
]

  }
