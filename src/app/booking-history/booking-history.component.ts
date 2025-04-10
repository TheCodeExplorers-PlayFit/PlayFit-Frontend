import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-booking-history',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './booking-history.component.html',
    styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent {
    bookings = [
        { id: 1, clubName: 'YMB sports club-Rawathawaththa', date: '1/2/2025', time: '8:30 AM - 10:30 AM' },
        { id: 2, clubName: 'YMB sports club-Rawathawaththa', date: '1/2/2025', time: '7:00 PM - 9:30 PM' },
        { id: 3, clubName: 'YMB sports club-Rawathawaththa', date: '1/2/2025', time: '8:30 AM - 10:30 AM' },
        { id: 4, clubName: 'Peak Performance Club-Koralawella', date: '1/2/2025', time: '8:30 AM - 10:30 AM' }
    ];

    viewBooking(booking: any) {
        console.log('View booking:', booking);
    }
   
}