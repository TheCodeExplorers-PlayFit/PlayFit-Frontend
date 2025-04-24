import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Notice {
  id: number;
  category: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

@Component({
  selector: 'app-special-notices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './special-notices.component.html',
  styleUrls: ['./special-notices.component.css']
})
export class SpecialNoticesComponent {
  primaryColor = '#000080';
  nextId = 6;

  notices: Notice[] = [
    {
      id: 1,
      category: 'About Players',
      title: 'New Training Schedules Available',
      description: 'New training plans for players are now live. Contact your coach.',
      date: 'Feb 10, 2025',
      author: 'Player Unit'
    },
    {
      id: 2,
      category: 'About Coaches',
      title: 'New Safety Guidelines for Training',
      description: 'All coaches must review the new safety procedures before conducting sessions.',
      date: 'Feb 12, 2025',
      author: 'Coach Management'
    },
    {
      id: 3,
      category: 'About Stadiums',
      title: 'Floodlight Repairs in Stadium A',
      description: 'Players: Lighting might be affected. Check alternatives.',
      date: 'Feb 18, 2025',
      author: 'Stadium Authority'
    },
    {
      id: 4,
      category: 'About Health Officers',
      title: 'New Injury Treatment Guidelines Implemented',
      description: 'Health protocols for sports-related injuries are now available.',
      date: 'Feb 20, 2025',
      author: 'Medical Team'
    },
    {
      id: 5,
      category: 'Others',
      title: 'Security Update for PlayFit Accounts',
      description: '2FA and password policy enforcement is live.',
      date: 'Feb 25, 2025',
      author: 'Platform Admin'
    }
  ];

  newNotice: Partial<Notice> = {};

  selectedNotice: Notice | null = null;

  addNotice() {
    if (
      this.newNotice.title &&
      this.newNotice.category &&
      this.newNotice.description &&
      this.newNotice.date &&
      this.newNotice.author
    ) {
      this.notices.push({
        ...(this.newNotice as Notice),
        id: this.nextId++
      });
      this.newNotice = {};
    }
  }

  editNotice(notice: Notice) {
    this.selectedNotice = { ...notice };
  }

  updateNotice() {
    const index = this.notices.findIndex(n => n.id === this.selectedNotice?.id);
    if (index > -1 && this.selectedNotice) {
      this.notices[index] = this.selectedNotice;
      this.selectedNotice = null;
    }
  }

  removeNotice(id: number) {
    this.notices = this.notices.filter(n => n.id !== id);
  }

  cancelEdit() {
    this.selectedNotice = null;
  }
}
