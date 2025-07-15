import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-complaints',
  imports: [CommonModule],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})

export class ComplaintsComponent {
  bgcolor1 : string = '#F3A4A4';
  bgcolor2 : string = '#C0C0DE';
  bgcolor3 : string = '#CFEDC6';
  bgcolor4 : string = '#F9C8F1';
  primarycolor : string = '#000080';
  buttongreen : string = '#76de1b63';
  marginLeft = '5px';
  marginTop = '78px';
  
cards= [
  {
   subtiitle : 'Total Complaints',
   value : 50,
   backgroundColor : '#F3A4A4',
  
  },
  {
    subtiitle : 'Pending Complaints',
   value : 15,
   backgroundColor : '#C0C0DE', 
 
  },
  {
    subtiitle : 'Resolved Complaints',
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
