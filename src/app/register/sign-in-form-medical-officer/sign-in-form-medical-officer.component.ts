import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in-form-medical-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in-form-medical-officer.component.html',
  styleUrl: './sign-in-form-medical-officer.component.css'
})
export class SignInFormMedicalOfficerComponent {

// Property to hold the selected file
selectedFile: File | null = null;

// File selection handler
onFileSelected(event: any): void {
  const fileInput = event.target;
  const file = fileInput.files[0]; // Get the first file selected
  if (file) {
    this.selectedFile = file;
    console.log("File selected:", file.name);
  }
}

// Optionally, a method to upload the file to Cloudinary or elsewhere
uploadFile() {
  if (this.selectedFile) {
    // Use your upload logic here to send the file to Cloudinary or your server
    console.log('Uploading file:', this.selectedFile);
  }
}

  // Simplified properties to match the common component approach
  imageUrl: string = 'https://media-hosting.imagekit.io//afbddd0fda9f46bd/image%208.png?Expires=1836109212&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=L4JtUHtl5O6DcvnUnOD8TGnmZPRS~D~WGsgMPvefh5ZDhMX9-~JSvx7ipPRM9U3nQdU8nJU-qWnuWhg7XizGg59V3cTFIlUK4s04grSX6L~wZRL9O7qLjSYtcXaHfTeUFAdtpxSvgobibmwieWEAR8ixeciNgNvFUjHJQXxhuJEDEmUsBY5liJaSklfhCEGVzIxUerkh8xA4KT6zq7h~r3VSAFNBBZ6qI7Cq3e9YNU~nwtOq8hfFWErp38xU66AeL4ycrcJPN7p0KILGOB4-0qZnQ8ICJbsbmmweMPqlPM2hSJkjAtAsGmnKpfJp1Vq9WHk-br1sFuJyAeFfgbzIWA__';
}