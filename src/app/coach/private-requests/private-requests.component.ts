import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-private-requests',
  standalone: true,  // Standalone component
  imports: [CommonModule], // Import CommonModule to use *ngFor
  templateUrl: './private-requests.component.html',
  styleUrls: ['./private-requests.component.css']
})
export class PrivateRequestsComponent {
  requests = [
    { name: 'John', stadium: 'Downtown Area', date: '2025-02-05', time: '8:30 AM - 10:30 AM' },
    { name: 'Emily', stadium: 'City Arena', date: '2025-02-06', time: '2:00 PM - 4:00 PM' },
    { name: 'Michael', stadium: 'National Stadium', date: '2025-02-07', time: '5:00 PM - 7:00 PM' }
  ];
}
