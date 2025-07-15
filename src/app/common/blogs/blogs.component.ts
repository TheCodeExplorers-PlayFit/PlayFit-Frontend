import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BlogService, Blog } from '../../services/blogs/blog.service';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsDisplayComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getApprovedBlogs().subscribe({
      next: (data:any) => this.blogs = data,
      error: (err:any) => console.error('Error loading blogs', err)
    });
  }
}
