import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-schedule-selector',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterModule],
  templateUrl: './schedule-selector.component.html',
  styleUrl: './schedule-selector.component.css',
})
export class ScheduleSelectorComponent {
  mondaySlots = ['8:30-10:30', '10:30-12:30', '1:00-3:00', '3:00-5:00', '5:00-7:00', '7:00-9:00'];
  tuesdaySlots = ['8:30-10:30', '10:30-12:30', '1:00-3:00', '3:00-5:00', '5:00-7:00', '7:00-9:00'];
  wednesdaySlots = ['8:30-10:30', '10:30-12:30', '1:00-3:00', '3:00-5:00', '5:00-7:00', '7:00-9:00'];
  thursdaySlots = ['8:30-10:30', '10:30-12:30', '1:00-3:00', '3:00-5:00', '5:00-7:00', '7:00-9:00'];
  fridaySlots = ['8:30-10:30', '10:30-12:30', '1:00-3:00', '3:00-5:00', '5:00-7:00', '7:00-9:00'];
  saturdaySlots = ['8:30-10:30', '10:30-12:30', '1:00-3:00', '3:00-5:00', '5:00-7:00', '7:00-9:00'];
  sundaySlots = ['8:30-10:30', '10:30-12:30', '1:00-3:00', '3:00-5:00', '5:00-7:00', '7:00-9:00'];

  selectedSlots: { [day: string]: string[] } = {};

  constructor(private router: Router) {}

  selectSlot(day: string, timeSlot: string) {
    if (!this.selectedSlots[day]) {
      this.selectedSlots[day] = [];
    }

    const index = this.selectedSlots[day].indexOf(timeSlot);
    if (index === -1) {
      this.selectedSlots[day].push(timeSlot);
    } else {
      this.selectedSlots[day].splice(index, 1);
    }
  }

  isSlotSelected(day: string, timeSlot: string) {
    return this.selectedSlots[day]?.includes(timeSlot);
  }

  navigateToBookingHistory() {
    this.router.navigate(['/schedule-selector']);
  }
}