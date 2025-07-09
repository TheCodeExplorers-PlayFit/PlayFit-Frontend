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

  constructor(private adminBlogsService: AdminBlogsService) {}

  ngOnInit(): void {
    this.loadPendingBlogs();
  }

  loadPendingBlogs(): void {
    console.log('loadPendingBlogs: Fetching pending blogs');
    this.adminBlogsService.getPendingBlogs().subscribe({
      next: (blogs) => {
        console.log('loadPendingBlogs: Fetched blogs:', blogs);
        this.blogRequests = blogs;
      },
      error: (err) => {
        console.error('loadPendingBlogs: Error fetching blogs:', err);
      }
    });
  }

  approveBlog(blog: Blog): void {
    console.log('approveBlog: Approving blog with ID:', blog.id);
    this.adminBlogsService.approveBlog(blog.id).subscribe({
      next: () => {
        console.log('approveBlog: Blog approved successfully');
        this.loadPendingBlogs(); // Refresh the list
      },
      error: (err) => {
        console.error('approveBlog: Error approving blog:', err);
      }
    });
  }

  rejectBlog(blog: Blog): void {
    console.log('rejectBlog: Rejecting blog with ID:', blog.id);
    this.adminBlogsService.rejectBlog(blog.id).subscribe({
      next: () => {
        console.log('rejectBlog: Blog rejected successfully');
        this.loadPendingBlogs(); // Refresh the list
      },
      error: (err) => {
        console.error('rejectBlog: Error rejecting blog:', err);
      }
    });
  }
}