import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { HealthTipsService } from '../../../services/healthtips/health-tips.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service'; // ✅ Import AuthService
import swal from 'sweetalert';


@Component({
  selector: 'app-safety-advice',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink ],
  templateUrl: './safety-advice.component.html',
  styleUrl: './safety-advice.component.css'
})
export class SafetyAdviceComponent implements OnInit {
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

    this.healthTipService.getHealthTipsByOfficerId(user.id).subscribe((res: any) => {
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
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this tip!",
    icon: "warning",
    buttons: ["Cancel", "Delete"],
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      this.healthTipService.deleteHealthTip(id).subscribe({
        next: () => {
          // Remove the deleted tip from the UI
          this.cards = this.cards.filter(card => card.id !== id);
          swal("Deleted!", "The health tip has been deleted.", "success");
        },
        error: (err) => {
          console.error('Delete failed', err);
          swal("Error", "Failed to delete the health tip.", "error");
        }
      });
    } else {
      swal("Cancelled", "The health tip is safe!", "info");
    }
  });
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
