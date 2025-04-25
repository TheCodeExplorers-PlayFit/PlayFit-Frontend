import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CoachSidebarComponent } from '../coach-sidebar/coach-sidebar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coach-layout',
  standalone: true,
  imports: [CoachSidebarComponent,CommonModule,RouterModule],
  templateUrl: './coach-layout.component.html',
  styleUrls: ['./coach-layout.component.css']
})
export class CoachLayoutComponent implements OnInit {
  isCoach: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.role === 'coach') {
      this.isCoach = true;
    } else {
      this.isCoach = false;
    }
  }
}
