import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { SportsService } from '../../services/sports/sports.service';

interface Sport {
  id: number;
  name: string;
}

@Component({
  selector: 'app-sign-in-form-coach',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in-form-coach.component.html',
  styleUrls: ['./sign-in-form-coach.component.css']
})
export class SignInFormCoachComponent implements OnInit {
  userData: any = {
    mobileNumber: '',
    age: null,
    gender: '',
    nic: '',
    sport1: null,
    sport2: null,
    sport3: null,
    experience: null,
    documentPath: null,
    role: 'coach'
  };
  commonData: any = {};
  errorMessage: string = '';
  termsAccepted: boolean = false;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  sports: Sport[] = [];

  constructor(
    private authService: AuthService,
    private sportsService: SportsService,
    private router: Router
  ) {}

  ngOnInit() {
    const state = history.state;
    console.log('State received in coach form:', state);
    if (state && state.commonData) {
      this.commonData = state.commonData;
      console.log('Common data received:', this.commonData);
    } else {
      console.error('No common data found, redirecting to common form');
      this.router.navigate(['/sign-in-form-common']);
    }

    this.sportsService.getSports().subscribe({
      next: (response) => {
        if (response.success) {
          this.sports = response.sports;
          console.log('Sports fetched:', this.sports);
        } else {
          this.errorMessage = 'Failed to load sports';
        }
      },
      error: (error) => {
        console.error('Error fetching sports:', error);
        this.errorMessage = 'Failed to load sports';
      }
    });
  }

  onFileSelected(event: any) {
    const fileInput = event.target;
    this.selectedFile = fileInput.files[0];
    if (this.selectedFile) {
      this.selectedFileName = this.selectedFile.name;
      console.log('File selected:', this.selectedFileName);
    } else {
      this.selectedFileName = '';
    }
  }

  getAvailableSports(exclude: (number | null)[]): Sport[] {
    return this.sports.filter(sport => !exclude.includes(sport.id));
  }

  onSportChange() {
    if (this.userData.sport2 && this.userData.sport2 === this.userData.sport1) {
      this.userData.sport2 = null;
    }
    if (this.userData.sport3 && (this.userData.sport3 === this.userData.sport1 || this.userData.sport3 === this.userData.sport2)) {
      this.userData.sport3 = null;
    }
    console.log('Sports updated:', {
      sport1: this.userData.sport1,
      sport2: this.userData.sport2,
      sport3: this.userData.sport3
    });
  }

  async onSubmit() {
    console.log('Submit button clicked');

    if (!this.userData.mobileNumber || !this.userData.age || !this.userData.gender || 
        !this.userData.nic || !this.userData.sport1 || !this.userData.experience) {
      this.errorMessage = 'Please fill in all required fields (Sport 1 and Experience are mandatory)';
      console.error('Form validation failed:', this.errorMessage);
      return;
    }

    if (!this.termsAccepted) {
      this.errorMessage = 'Please accept the terms and conditions';
      console.error('Terms not accepted');
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Please upload a verification document';
      console.error('No file uploaded');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('upload_preset', 'verificationDocuments');
      formData.append('resource_type', 'raw');

      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dych7ol8z/raw/upload', {
        method: 'POST',
        body: formData
      }).then(res => res.json());

      console.log('Cloudinary response:', cloudinaryResponse);

      if (cloudinaryResponse.secure_url) {
        this.userData.documentPath = cloudinaryResponse.secure_url;
        console.log('File uploaded to Cloudinary:', this.userData.documentPath);
      } else {
        throw new Error('Cloudinary upload failed: No secure_url returned');
      }

      this.userData.sport1 = this.userData.sport1 || null;
      this.userData.sport2 = this.userData.sport2 || null;
      this.userData.sport3 = this.userData.sport3 || null;

      console.log('Sports before submission:', {
        sport1: this.userData.sport1,
        sport2: this.userData.sport2,
        sport3: this.userData.sport3
      });

      const completeUserData = {
        ...this.commonData,
        ...this.userData
      };

      console.log('Submitting complete user data:', completeUserData);

      this.authService.register(completeUserData).subscribe({
        next: (response) => {
          console.log('Registration successful!', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.errorMessage = error.message || 'Registration failed. Please try again.';
        }
      });
    } catch (error: any) {
      console.error('Error during submission:', error);
      this.errorMessage = error.message || 'An error occurred during registration. Please try again.';
    }
  }
}