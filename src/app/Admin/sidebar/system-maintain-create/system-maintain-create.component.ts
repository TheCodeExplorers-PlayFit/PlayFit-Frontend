import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-system-maintain-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './system-maintain-create.component.html',
  styleUrls: ['./system-maintain-create.component.css']
})
export class SystemMaintainCreateComponent {
  uploadedImage: string | null = null;
  notice: string = '';
  maintenanceMode: boolean = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.uploadedImage = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  saveData() {
    const data = {
      image: this.uploadedImage,
      notice: this.notice,
      maintenance: this.maintenanceMode
    };
    localStorage.setItem('maintenanceData', JSON.stringify(data));
    alert('Maintenance notice saved!');
  }
}