import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  isEditing = false;
  searchTerm = '';
  searchResults: any[] = [];
  selectedUser: any = null;
  private apiUrl = 'http://localhost:5000/api/profile';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const token = localStorage.getItem('token');
    this.http
      .get(`${this.apiUrl}/me`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .subscribe({
        next: (response: any) => {
          this.user = response;
        },
        error: (error) => {
          console.error('Error loading profile:', error);
        },
      });
  }

  uploadProfilePicture(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'profile_upload');

      this.http
        .post(
          `https://api.cloudinary.com/v1_1/${'dych7ol8z'}/image/upload`,
          formData
        )
        .subscribe({
          next: (response: any) => {
            const profilePictureUrl = response.secure_url;
            this.updateProfilePicture(profilePictureUrl);
          },
          error: (error) => {
            console.error('Error uploading to Cloudinary:', error);
          },
        });
    }
  }

  updateProfilePicture(profilePictureUrl: string) {
    const token = localStorage.getItem('token');
    this.http
      .put(
        `${this.apiUrl}/update-picture`,
        { profile_picture: profilePictureUrl },
        {
          headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
        }
  )
      .subscribe({
        next: () => {
          this.user.profile_picture = profilePictureUrl;
        },
        error: (error) => {
          console.error('Error updating profile picture:', error);
        },
      });
  }

  saveProfile() {
    const token = localStorage.getItem('token');
    this.http
      .put(
        `${this.apiUrl}/update`,
        {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          mobile_number: this.user.mobile_number,
        },
        {
          headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
        }
      )
      .subscribe({
        next: () => {
          this.isEditing = false;
          this.loadProfile();
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        },
      });
  }

  searchUsers() {
    if (this.searchTerm.length < 2) {
      this.searchResults = [];
      return;
    }
    const token = localStorage.getItem('token');
    this.http
      .get(`${this.apiUrl}/search?term=${this.searchTerm}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .subscribe({
        next: (response: any) => {
          this.searchResults = response;
        },
        error: (error) => {
          console.error('Error searching users:', error);
        },
      });
  }

  openUserModal(user: any) {
    this.selectedUser = user;
    this.searchTerm = '';
    this.searchResults = [];
  }

  closeUserModal() {
    this.selectedUser = null;
  }
}