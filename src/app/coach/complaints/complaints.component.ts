import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent {
  complaint = {
    name: '',
    contactNumber: '',
    stadium: '',
    userType: '',
    complaintText: ''
  };

  stadiums = [
    { name: 'YMB Sports Club - Rawathawaththa' },
    { name: 'Galaxy Sports League - Katubedda' }
  ];

  userTypes = ['Player', 'Coach', 'Stadium Owner', 'Health Officer'];

  onSubmit() {
    console.log('Form submitted:', this.complaint);
    alert('Complaint submitted successfully!');
    this.resetForm();
  }

  resetForm() {
    this.complaint = {
      name: '',
      contactNumber: '',
      stadium: '',
      userType: '',
      complaintText: ''
    };
  }
}