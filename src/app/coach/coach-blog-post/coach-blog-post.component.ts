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
  title = '';
  content = '';
  image: File | null = null;
  message = '';
  isUploading = false;

  cloudName = 'dfafezdx5'; // put your Cloudinary cloud name here
  uploadPreset = 'unsigned_preset'; // create this in your Cloudinary dashboard

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.image = event.target.files[0];
  }

  async uploadImageToCloudinary(file: File): Promise<string> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const response: any = await this.http.post(url, formData).toPromise();
    return response.secure_url; // this is the image URL
  }

  async submitBlog() {
    if (!this.title || !this.content) {
      this.message = 'Title and Content are required.';
      return;
    }

    this.isUploading = true;
    this.message = '';

    try {
      let imageUrl = null;
      if (this.image) {
        imageUrl = await this.uploadImageToCloudinary(this.image);
      }

      const token = localStorage.getItem('token') || '';
      const blogData = {
        title: this.title,
        content: this.content,
        image: imageUrl,
        status: 'pending',
      };

      await this.http.post('http://localhost:5000/api/coach-sessions/blogs', blogData, {
        headers: { Authorization: `Bearer ${token}` }
      }).toPromise();

      this.message = 'Blog submitted successfully!';
      this.title = '';
      this.content = '';
      this.image = null;
    } catch (error) {
      console.error(error);
      this.message = 'Error submitting blog.';
    } finally {
      this.isUploading = false;
    }
  }
}
