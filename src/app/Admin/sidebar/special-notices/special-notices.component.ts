// admin/sidebar/special-notices/special-notices.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    notice_date: '', // Changed to match backend field name
    author: ''
  };
  notices: any[] = [];
  editingNotice: any = null;
  viewingNotice: any = null; // For viewing full notice

  constructor(private announcementService: AnnouncementService) {}

  ngOnInit() {
    this.loadNotices();
  }

  loadNotices() {
    this.announcementService.getNotices().subscribe({
      next: (data) => {
        this.notices = data;
      },
      error: (error) => {
        console.error('Error fetching notices:', error);
      }
    });
  }

  createNotice() {
    const noticeData = {
      admin_id: this.adminId,
      ...this.newNotice
    };

    this.announcementService.createNotice(noticeData).subscribe({
      next: () => {
        this.loadNotices();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating notice:', error);
      }
    });
  }

  editNotice(notice: any) {
    this.editingNotice = notice;
    this.newNotice = { ...notice }; // Copy notice fields to form
  }

  updateNotice() {
    if (!this.editingNotice) return;

    this.announcementService.updateNotice(this.editingNotice.id, this.newNotice).subscribe({
      next: () => {
        this.loadNotices();
        this.resetForm();
        this.editingNotice = null;
      },
      error: (error) => {
        console.error('Error updating notice:', error);
      }
    });
  }

  deleteNotice(id: number) {
    if (confirm('Are you sure you want to delete this notice?')) {
      this.announcementService.deleteNotice(id).subscribe({
        next: () => {
          this.loadNotices();
        },
        error: (error) => {
          console.error('Error deleting notice:', error);
        }
      });
    }
  }

  viewNotice(notice: any) {
    this.viewingNotice = notice; // Set the notice to view
  }

  closeView() {
    this.viewingNotice = null; // Close the view modal
  }

  resetForm() {
    this.newNotice = {
      category: '',
      title: '',
      description: '',
      notice_date: '',
      author: ''
    };
  }

  cancelEdit() {
    this.resetForm();
    this.editingNotice = null;
  }
}
