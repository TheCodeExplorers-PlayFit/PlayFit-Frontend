import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance-requests',
  imports: [CommonModule],
  templateUrl: './maintenance-requests.component.html',
  styleUrl: './maintenance-requests.component.css'
})

export class MaintenanceRequestsComponent {
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
   subtiitle : 'Total Tasks',
   value : 50,
   backgroundColor : '#F3A4A4',
  },
  {
    subtiitle : 'Pending Tasks',
   value : 15,
   backgroundColor : '#C0C0DE', 
  },
  {
    subtiitle : 'Completed Tasks',
   value : 20,
   backgroundColor : '#CFEDC6',
  },
  {
    subtiitle : 'In Progress',
   value : 15,
   backgroundColor : '#F9C8F1', 
  },
]

  }
