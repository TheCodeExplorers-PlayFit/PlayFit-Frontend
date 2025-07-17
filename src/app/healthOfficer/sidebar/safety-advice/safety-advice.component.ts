import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { HealthTipsService } from '../../../services/healthtips/health-tips.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-safety-advice',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './safety-advice.component.html',
  styleUrl: './safety-advice.component.css'
})
export class SafetyAdviceComponent implements OnInit {
  cards: any[] = [];
  search: string = '';
  marginLeft = '300px';
  marginTop = '80px';
  primaryColor: string = '#000080';

  constructor(
    private healthTipService: HealthTipsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.healthTipService.getHealthTipsByOfficerId(2).subscribe((res: any) => {
      if (res.success) {
        this.cards = res.data.map((tip: any) => ({
          id: tip.id,
          title: tip.title,
          description: this.extractText(tip.content),
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

  editHealthTip(id: number): void {
  this.router.navigate(['/health/safety-advice-form', id]);
}


  deleteHealthTip(id: number): void {
    if (confirm('Are you sure you want to delete this safety tip?')) {
      this.healthTipService.deleteHealthTip(id).subscribe({
        next: () => {
          this.cards = this.cards.filter(card => card.id !== id);
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Failed to delete the tip.');
        }
      });
    }
  }

  viewHealthTip(id: number): void {
  this.router.navigate(['/health-tip', id]); // Adjust route as per your routing
}

extractText(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  return text.length > 100 ? text.substring(0, 75) + '...' : text;
}

get filteredCards() {
  return this.cards.filter(card =>
    card.title.toLowerCase().includes(this.search.toLowerCase())
  );
}


}
