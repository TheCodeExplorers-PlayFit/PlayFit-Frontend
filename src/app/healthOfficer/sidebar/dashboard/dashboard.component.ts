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
  marginLeft = '300px';
  marginTop = '78px';
  
cards= [
  {
   subtiitle : 'Patients',
   value : 120,
   text: 'Since last week',
   backgroundColor : '#F3A4A4',
   icon : 'bi bi-people'
  },
  {
    subtiitle : 'Appointments',
   value : 98,
   text: 'Since last week',
   backgroundColor : '#C0C0DE', 
   icon : 'bi bi-calendar-event'
  },
  {
    subtiitle : 'Critical Alerts',
   value : 48,
   text: 'Since last week',
   backgroundColor : '#CFEDC6', 
   icon :'bi bi-exclamation-triangle'
  },
  {
    subtiitle : 'Salary',
   value : 'Rs 22000',
   text: 'Since last week',
   backgroundColor : '#F9C8F1', 
   icon : 'bi bi-cash-stack'
  },
]

  }

