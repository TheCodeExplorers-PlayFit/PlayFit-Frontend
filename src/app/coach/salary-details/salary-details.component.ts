import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

// Import CoachSalaryService and CoachSalary interface with named imports
import { CoachSalaryService, CoachSalary } from '../../services/coach-salary/coach-salary.service';

@Component({
  selector: 'app-salary-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.css']
})
export class SalaryDetailsComponent implements OnInit {
  coachSalaries: CoachSalary[] = [];
  error: string | null = null;
  loading: boolean = true;

  constructor(private coachSalaryService: CoachSalaryService) { }

  ngOnInit(): void {
    this.loadSalaries();
  }

  loadSalaries(): void {
    this.loading = true;
    this.coachSalaryService.getCoachSalaries().subscribe({
      next: (salaries:any) => {
        console.log('Received salaries:', salaries);
        this.coachSalaries = salaries;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your salary details. Please try again later.';
        this.loading = false;
        console.error('Error fetching salaries:', err);
      }
    });
  }
}