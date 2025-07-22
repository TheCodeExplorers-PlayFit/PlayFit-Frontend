import { Component } from '@angular/core';
import { HealthTipsService } from '../../services/healthtips/health-tips.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-health-tips',
   imports: [CommonModule, FormsModule, RouterLink ],
  templateUrl: './health-tips.component.html',
  styleUrl: './health-tips.component.css'
})
export class HealthTipsComponent {
cards: any[] = [];
  search: string = '';
  marginLeft = '300px';
  marginTop = '60px';
  primaryColor: string = '#000080';

  constructor(
    private healthTipService: HealthTipsService,
    private authService: AuthService,         // ✅ Inject AuthService
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();  // ✅ Get user
    if (!user || !user.id) {
      alert('❌ Unable to fetch user info.');
      return;
    }

    this.healthTipService.getAllPublicHealthTips().subscribe((res: any) => {
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


