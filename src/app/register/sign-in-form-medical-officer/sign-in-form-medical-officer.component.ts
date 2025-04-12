import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sign-in-form-medical-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in-form-medical-officer.component.html',
  styleUrls: ['./sign-in-form-medical-officer.component.css']
})
export class SignInFormMedicalOfficerComponent implements OnInit {
  imageUrl: string = 'https://media-hosting.imagekit.io//afbddd0fda9f46bd/image%208.png?Expires=1836109212&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=L4JtUHtl5O6DcvnUnOD8TGnmZPRS~D~WGsgMPvefh5ZDhMX9-~JSvx7ipPRM9U3nQdU8nJU-qWnuWhg7XizGg59V3cTFIlUK4s04grSX6L~wZRL9O7qLjSYtcXaHfTeUFAdtpxSvgobibmwieWEAR8ixeciNgNvFUjHJQXxhuJEDEmUsBY5liJaSklfhCEGVzIxUerkh8xA4KT6zq7h~r3VSAFNBBZ6qI7Cq3e9YNU~nwtOq8hfFWErp38xU66AeL4ycrcJPN7p0KILGOB4-0qZnQ8ICJbsbmmweMPqlPM2hSJkjAtAsGmnKpfJp1Vq9WHk-br1sFuJyAeFfgbzIWA__';
  userData: any = {
    mobileNumber: '',
    age: null,
    gender: '',
    nic: '',
    additionalInfo: '',
    documentPath: null,
    role: 'medicalOfficer'
  };
  commonData: any = {};
  errorMessage: string = '';
  termsAccepted: boolean = false;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const state = history.state;
    console.log('State received in medical officer form:', state);
    if (state && state.commonData) {
      this.commonData = state.commonData;
      console.log('Common data received:', this.commonData);
    } else {
      console.error('No common data found, redirecting to common form');
      this.router.navigate(['/sign-in-form-common']);
    }
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

  async onSubmit() {
    console.log('Submit button clicked');

    if (!this.userData.mobileNumber || !this.userData.age || !this.userData.gender || 
        !this.userData.nic || !this.userData.additionalInfo) {
      this.errorMessage = 'Please fill in all required fields';
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
      formData.append('upload_preset', 'verificationDocuments2');
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