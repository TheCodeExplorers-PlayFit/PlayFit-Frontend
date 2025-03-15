import { Component } from '@angular/core';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in-form-common',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sign-in-form-common.component.html',
  styleUrl: './sign-in-form-common.component.css'
})
export class SignInFormCommonComponent {
  role: string | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.role = navigation?.extras.state?.['role'];
  }

  goToRoleSpecificForm(): void {
    if (this.role) {
      switch (this.role) {
        case 'player':
          this.router.navigate(['/sign-in-form']);
          break;
        case 'coach':
          this.router.navigate(['/sign-in-form-coach']);
          break;
        case 'stadiumOwner':
          this.router.navigate(['/sign-in-form-stadium-owner']);
          break;
        case 'medicalOfficer':
          this.router.navigate(['/sign-in-form-medical-officer']);
          break;
        default:
          this.router.navigate(['/role-selection']);
      }
    }
  }
}
