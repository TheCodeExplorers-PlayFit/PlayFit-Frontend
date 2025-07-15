import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HealthTipsService } from '../../../services/healthtips/health-tips.service';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-safety-advice',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './safety-advice.component.html',
  styleUrl: './safety-advice.component.css'
})
export class SafetyAdviceComponent implements OnInit {
  cards: any[] = [];
  search: string = 'Search safety tips...';
  marginLeft = '300px';
  marginTop = '78px';
  primaryColor: string = '#000080';

  constructor(private healthTipService: HealthTipsService) {}

  ngOnInit(): void {
    // Get health tips by officer id (e.g., 2)
    this.healthTipService.getHealthTipsByOfficerId(2).subscribe((res: any) => {
      if (res.success) {
        this.cards = res.data.map((tip: any) => ({
          title: tip.title,
          description: tip.content,
          image: tip.image_url,
          updatedate: `Last updated ${this.timeAgo(tip.createdAt)}`
        }));
      }
    });
  }

  timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((+now - +date) / 60000); // in minutes
    return diff < 60 ? `${diff} mins ago` : `${Math.floor(diff / 60)} hrs ago`;
  }
}
