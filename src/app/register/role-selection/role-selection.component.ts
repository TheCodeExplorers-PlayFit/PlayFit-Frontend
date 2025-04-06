import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.css'
})
export class RoleSelectionComponent {
  selectedRole: string | null = null;

  constructor(private router: Router) {}

  selectRole(role: string): void {
    this.selectedRole = role;
  }

  goToNextPage(): void {
    if (this.selectedRole) {
      this.router.navigate(['/sign-in-form-common'], {
        state: { role: this.selectedRole },
      });
    }
  }
}
