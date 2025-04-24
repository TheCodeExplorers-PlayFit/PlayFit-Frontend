import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-maintain-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-maintain-view.component.html',
  styleUrls: ['./system-maintain-view.component.css']
})
export class SystemMaintainViewComponent implements OnInit {
  image: string | null = null;
  notice: string = '';
  maintenance: boolean = false;

  ngOnInit(): void {
    const data = localStorage.getItem('maintenanceData');
    if (data) {
      const parsed = JSON.parse(data);
      this.image = parsed.image;
      this.notice = parsed.notice;
      this.maintenance = parsed.maintenance;
    }
  }
}
