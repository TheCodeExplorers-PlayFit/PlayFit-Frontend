import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReportCard {
  id: number;
  category: string;
  description: string;
  links: { label: string; url: string }[];
  color: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  primaryColor = '#000080';

  reports: ReportCard[] = [
    {
      id: 1,
      category: '💰 Financial & Transaction Reports',
      description: 'Reports related to revenue and payments',
      links: [
        { label: 'stadium revenue', url: 'https://metabase.example.com/dashboard/stadium-revenue' },
        { label: 'coaches revenue', url: 'https://metabase.example.com/dashboard/coach-revenue' },
        { label: 'players payments', url: 'https://metabase.example.com/dashboard/player-payments' }
      ],
      color: '#FBCACA'
    },
    {
      id: 2,
      category: '🚑 Medical Emergency Reports',
      description: 'Health-related emergency insights',
      links: [
        { label: 'Player Injury Reports', url: 'https://metabase.example.com/dashboard/injuries' }
      ],
      color: '#D9D9F3'
    },
    {
      id: 3,
      category: '📋 Stadiums & Booking Issues',
      description: 'Reports related to venue usage',
      links: [
        { label: 'Stadium Maintenance', url: 'https://metabase.example.com/dashboard/maintenance' },
        { label: 'Stadium delays', url: 'https://metabase.example.com/dashboard/delays' }
      ],
      color: '#D9F3D9'
    },
    {
      id: 4,
      category: 'Others',
      description: 'Miscellaneous insights',
      links: [
        { label: 'user details', url: 'https://metabase.example.com/dashboard/user-info' }
      ],
      color: '#F3D9F3'
    }
  ];

  viewReport(url: string) {
    window.open(url, '_blank');
  }

  editReport(id: number) {
    alert(`Edit form or modal for report ID: ${id}`);
  }

  uploadReport(id: number) {
    alert(`Upload new report for ID: ${id}`);
  }

  downloadReport(id: number) {
    alert(`Trigger download for report ID: ${id}`);
  }
}
