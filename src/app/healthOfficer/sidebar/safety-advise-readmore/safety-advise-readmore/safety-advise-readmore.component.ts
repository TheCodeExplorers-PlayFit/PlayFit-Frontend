import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HealthTipsService } from '../../../../services/healthtips/health-tips.service';

@Component({
  selector: 'app-safety-advice-readmore',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './safety-advise-readmore.component.html',
  styleUrl: './safety-advise-readmore.component.css'
})
export class SafetyAdviceReadmoreComponent implements OnInit {
  healthTip: any = null;
  relatedTips: any[] = [];
  loading = true;
  error = '';
  tipId!: number;
  marginTop = '80px';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private healthTipsService: HealthTipsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.tipId = +idParam;
        this.loadHealthTip();
      } else {
        this.error = 'Invalid article ID';
        this.loading = false;
      }
    });
  }

  loadHealthTip(): void {
    this.loading = true;
    this.error = '';

    this.healthTipsService.getHealthTipById(this.tipId).subscribe({
      next: (response) => {
        if (response.success) {
          this.healthTip = response.data;
          this.loadRelatedTips();
        } else {
          this.error = 'Failed to load article';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading health tip:', err);
        this.error = 'Error loading article. Please try again.';
        this.loading = false;
      }
    });
  }

  loadRelatedTips(): void {
    if (!this.healthTip.category) {
      this.loading = false;
      return;
    }

    this.healthTipsService.getHealthTipsByCategory(this.healthTip.category).subscribe({
      next: (response) => {
        if (response.success) {
          // Filter out current article and limit to 4 related tips
          this.relatedTips = response.data
            .filter((tip: any) => tip.id !== this.tipId)
            .slice(0, 4);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading related tips:', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((+now - +date) / 60000); // in minutes
    
    if (diff < 60) {
      return `${diff} mins ago`;
    } else if (diff < 1440) {
      return `${Math.floor(diff / 60)} hrs ago`;
    } else {
      return `${Math.floor(diff / 1440)} days ago`;
    }
  }

  extractText(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  }

  shareArticle(): void {
    if (navigator.share) {
      navigator.share({
        title: this.healthTip.title,
        text: this.extractText(this.healthTip.content),
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Article link copied to clipboard!');
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
  }

  printArticle(): void {
    window.print();
  }

  bookmarkArticle(): void {
    // This is a simple implementation - you might want to integrate with a bookmarking service
    alert('Article bookmarked! (This is a demo implementation)');
  }
}