import { Routes } from '@angular/router';
import { SignInPageComponent } from './auth/sign-in-page/sign-in-page.component';
import { CoachLayoutComponent } from './coach/coach-layout/coach-layout.component';
import { DashboardComponent } from './coach/dashboard/dashboard.component';
import { StadiumListComponent } from './coach/stadium-list/stadium-list.component';
import { AuthService } from './services/auth/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: () => {
      const authService = inject(AuthService);
      const router = inject(Router);
      const user = authService.getUser();
      console.log('Redirect - User:', user);
      if (user) {
        switch (user.role) {
          case 'coach':
            return '/coach/dashboard';
          case 'player':
            return '/player/dashboard';
          case 'stadium-owner':
            return '/stadium-owner/dashboard';
          case 'healthOfficer':
            return '/health/dashboard';
          default:
            return '/sign-in';
        }
      }
      return '/sign-in';
    },
    pathMatch: 'full' 
  },
  { path: 'sign-in', component: SignInPageComponent },
  {
    path: 'coach',
    component: CoachLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'stadium-list', component: StadiumListComponent },
      // Other coach routes...
    ]
  },
  // Other routes...
];