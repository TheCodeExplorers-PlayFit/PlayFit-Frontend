import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-coach-blog-post',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './coach-blog-post.component.html',
  styleUrls: ['./coach-blog-post.component.css']
})
export class CoachBlogPostComponent {
  title: string = '';
  content: string = '';
  image: File | null = null;
  message: string = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.image = event.target.files[0];
  }

  submitBlog() {
  if (!this.title || !this.content) {
    this.message = 'Title and Content are required.';
    return;
  }

  const formData = new FormData();
  formData.append('title', this.title);
  formData.append('content', this.content);
  if (this.image) {
    formData.append('image', this.image);
  }

  // Get the token from localStorage or wherever you store it
  const token = localStorage.getItem('token') || '';

  this.http.post('http://localhost:5000/api/coach-sessions/blogs', formData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .subscribe({
    next: () => {
      this.message = 'Blog submitted successfully!';
      this.title = '';
      this.content = '';
      this.image = null;
    },
    error: () => {
      this.message = 'Error submitting blog.';
    }
  });
}
}
