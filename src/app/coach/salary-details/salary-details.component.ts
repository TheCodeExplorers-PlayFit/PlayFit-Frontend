import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CoachSalaryService, CoachSalary } from '../../services/coach-salary/coach-salary.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  constructor(private coachSalaryService: CoachSalaryService) {}

  ngOnInit(): void {
    this.loadSalaries();
  }

  loadSalaries(): void {
    this.loading = true;
    this.coachSalaryService.getCoachSalaries().subscribe({
      next: (salaries) => {
        console.log('Salaries:', salaries);
        this.coachSalaries = salaries;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load salary details.';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  generateSalaryReport(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Play Fit Coach Salary Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    if (this.coachSalaries.length > 0) {
      doc.setFontSize(12);
      doc.text('Salary Details:', 14, 62);
      autoTable(doc, {
        startY: 68,
        head: [['Coach ID', 'Coach Name', 'Total Salary']],
        body: this.coachSalaries.map(salary => [
          salary.coach_id,
          salary.coach_name || 'N/A',
          `$${salary.total_salary.toFixed(2)}`
        ]),
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [20, 40, 80], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
    } else {
      doc.setFontSize(12);
      doc.text('No salary data available', 14, 62);
    }

    const coachId = this.coachSalaries.length > 0 ? this.coachSalaries[0].coach_id : 'Unknown';
    doc.save(`Coach_${coachId}_Salary_Report.pdf`);
  }
}