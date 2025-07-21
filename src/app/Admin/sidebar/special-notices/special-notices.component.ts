// admin/sidebar/special-notices/special-notices.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../../services/announcement/announcement.service';

@Component({
  selector: 'app-special-notices',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './special-notices.component.html',
  styleUrls: ['./special-notices.component.css']
})
export class SpecialNoticesComponent implements OnInit {
  adminId: number = 20; // Hardcoded for now, replace with actual admin ID from auth
  
  newNotice = {
    category: '',
    title: '',
    description: '',
    notice_date: '',
    author: ''
  };
  
  notices: any[] = [];
  editingNotice: any = null;
  viewingNotice: any = null;
  isSubmitting = false;
  
  // Date constraints
  minDate: string = '';
  maxDate: string = '';

  constructor(private announcementService: AnnouncementService) {
    this.setDateConstraints();
  }

  ngOnInit() {
    this.loadNotices();
  }

  /**
   * Set minimum and maximum dates for the date picker
   */
  private setDateConstraints(): void {
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    // Set minimum date to today
    this.minDate = today.toISOString().split('T')[0];
    
    // Set maximum date to one year from now
    this.maxDate = oneYearFromNow.toISOString().split('T')[0];
  }

  /**
   * Load all notices from the server
   */
  loadNotices(): void {
    this.announcementService.getNotices().subscribe({
      next: (data) => {
        this.notices = data;
        console.log('Loaded notices:', data);
      },
      error: (error) => {
        console.error('Error fetching notices:', error);
        this.showAlert('Error loading notices. Please try again.', 'error');
      }
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.editingNotice) {
        this.updateNotice();
      } else {
        this.createNotice();
      }
    } else {
      this.markFormGroupTouched(form);
      this.showAlert('Please fill in all required fields correctly.', 'error');
    }
  }

  /**
   * Create a new notice
   */
  createNotice(): void {
    this.isSubmitting = true;
    
    const noticeData = {
      admin_id: this.adminId,
      category: this.newNotice.category.trim(),
      title: this.newNotice.title.trim(),
      description: this.newNotice.description.trim(),
      notice_date: this.formatDateForBackend(this.newNotice.notice_date),
      author: this.newNotice.author.trim()
    };

    this.announcementService.createNotice(noticeData).subscribe({
      next: (response) => {
        console.log('Notice created successfully:', response);
        this.loadNotices();
        this.resetForm();
        this.showAlert('Notice created successfully!', 'success');
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error creating notice:', error);
        this.showAlert('Error creating notice. Please try again.', 'error');
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Update an existing notice
   */
  updateNotice(): void {
    if (!this.editingNotice) return;
    
    this.isSubmitting = true;
    
    const updateData = {
      category: this.newNotice.category.trim(),
      title: this.newNotice.title.trim(),
      description: this.newNotice.description.trim(),
      notice_date: this.formatDateForBackend(this.newNotice.notice_date),
      author: this.newNotice.author.trim()
    };

    this.announcementService.updateNotice(this.editingNotice.id, updateData).subscribe({
      next: (response) => {
        console.log('Notice updated successfully:', response);
        this.loadNotices();
        this.resetForm();
        this.editingNotice = null;
        this.showAlert('Notice updated successfully!', 'success');
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error updating notice:', error);
        this.showAlert('Error updating notice. Please try again.', 'error');
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Set a notice for editing
   */
  editNotice(notice: any): void {
    this.editingNotice = notice;
    this.newNotice = {
      category: notice.category,
      title: notice.title,
      description: notice.description,
      notice_date: this.formatDateForInput(notice.notice_date),
      author: notice.author
    };
    
    // Scroll to form
    document.querySelector('.notice-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Delete a notice
   */
  deleteNotice(id: number): void {
    if (confirm('Are you sure you want to delete this notice? This action cannot be undone.')) {
      this.announcementService.deleteNotice(id).subscribe({
        next: (response) => {
          console.log('Notice deleted successfully:', response);
          this.loadNotices();
          this.showAlert('Notice deleted successfully!', 'success');
        },
        error: (error) => {
          console.error('Error deleting notice:', error);
          this.showAlert('Error deleting notice. Please try again.', 'error');
        }
      });
    }
  }

  /**
   * View a notice in modal
   */
  viewNotice(notice: any): void {
    this.viewingNotice = notice;
  }

  /**
   * Close the view modal
   */
  closeView(): void {
    this.viewingNotice = null;
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    this.newNotice = {
      category: '',
      title: '',
      description: '',
      notice_date: '',
      author: ''
    };
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.resetForm();
    this.editingNotice = null;
  }

  /**
   * Format date for backend (YYYY/MM/DD)
   */
  private formatDateForBackend(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  /**
   * Format date for input field (YYYY-MM-DD)
   */
  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    // Convert from YYYY/MM/DD to YYYY-MM-DD
    return dateString.replace(/\//g, '-');
  }

  /**
   * Format date for display (DD/MM/YYYY)
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString.replace(/\//g, '-'));
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Format datetime for display
   */
  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-GB');
    } catch (error) {
      return dateTimeString;
    }
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByNoticeId(index: number, notice: any): number {
    return notice.id;
  }

  /**
   * Mark all form controls as touched to show validation errors
   */
  private markFormGroupTouched(form: NgForm): void {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  }

  /**
   * Show alert message (you can replace this with a proper toast notification)
   */
  private showAlert(message: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      alert('✅ ' + message);
    } else {
      alert('❌ ' + message);
    }
  }
}