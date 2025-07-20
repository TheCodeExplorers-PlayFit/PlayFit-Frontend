import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminBlogsService, Blog } from '../../../services/adminblogs/adminblogs.service';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogRequests: Blog[] = [];
  selectedBlog: Blog | null = null;
  loading = false;

  constructor(private adminBlogsService: AdminBlogsService) {}

  ngOnInit(): void {
    this.loadPendingBlogs();
  }

  loadPendingBlogs(): void {
    console.log('loadPendingBlogs: Fetching pending blogs');
    this.loading = true;
    this.adminBlogsService.getPendingBlogs().subscribe({
      next: (blogs) => {
        console.log('loadPendingBlogs: Fetched blogs:', blogs);
        this.blogRequests = blogs;
        this.loading = false;
      },
      error: (err) => {
        console.error('loadPendingBlogs: Error fetching blogs:', err);
        this.loading = false;
      }
    });
  }

  viewBlog(blog: Blog): void {
    console.log('viewBlog: Viewing blog with ID:', blog.id);
    this.loading = true;
    this.adminBlogsService.getBlogById(blog.id).subscribe({
      next: (fullBlog) => {
        console.log('viewBlog: Fetched full blog:', fullBlog);
        this.selectedBlog = fullBlog;
        this.loading = false;
      },
      error: (err) => {
        console.error('viewBlog: Error fetching blog:', err);
        this.loading = false;
        // Fallback to the basic blog data if detailed fetch fails
        this.selectedBlog = blog;
      }
    });
  }

  closeBlogView(): void {
    this.selectedBlog = null;
  }

  approveBlog(blog: Blog): void {
    console.log('approveBlog: Approving blog with ID:', blog.id);
    this.adminBlogsService.approveBlog(blog.id).subscribe({
      next: () => {
        console.log('approveBlog: Blog approved successfully');
        // Close modal if it's open
        if (this.selectedBlog && this.selectedBlog.id === blog.id) {
          this.closeBlogView();
        }
        this.loadPendingBlogs(); // Refresh the list
      },
      error: (err) => {
        console.error('approveBlog: Error approving blog:', err);
        alert('Error approving blog. Please try again.');
      }
    });
  }

  rejectBlog(blog: Blog): void {
    if (confirm('Are you sure you want to reject and delete this blog? This action cannot be undone.')) {
      console.log('rejectBlog: Rejecting blog with ID:', blog.id);
      this.adminBlogsService.rejectBlog(blog.id).subscribe({
        next: () => {
          console.log('rejectBlog: Blog rejected successfully');
          // Close modal if it's open
          if (this.selectedBlog && this.selectedBlog.id === blog.id) {
            this.closeBlogView();
          }
          this.loadPendingBlogs(); // Refresh the list
        },
        error: (err) => {
          console.error('rejectBlog: Error rejecting blog:', err);
          alert('Error rejecting blog. Please try again.');
        }
      });
    }
  }
}