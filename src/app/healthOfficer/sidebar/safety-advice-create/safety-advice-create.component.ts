import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-safety-advice-create',
  imports: [CommonModule,RouterLink,RouterOutlet,RouterLinkActive,CommonModule,FormsModule],
  templateUrl: './safety-advice-create.component.html',
  styleUrl: './safety-advice-create.component.css'
})
export class SafetyAdviceCreateComponent {
 @ViewChild('editor') editor!: ElementRef; // Reference to contenteditable div
  @ViewChild('inputImage') inputImage!: ElementRef;

  marginLeft = '300px';
  marginTop = '78px';
  contentWidth :string= '600px';
  bgColor = '#f8f8f8';
  textred : string = '#EB1E1E';
  primaryColor : string = '#000080';
  pureWhite : string = '#ffffff';
  placeholder1 : string = 'Effective Recovery Strategies for Athletes';
  categoryList : string[] = ["Public Health & Safety","Injury Prevention & First Aid"," Mental Health & Well-being","Nutrition & Diet","Chronic Disease Management"," Fitness & Physical Activity"," Fitness & Physical Activity","Workplace & Occupational Health"];
  buttonWidth : string = '250px';

  title = '';
  category = '';
  content = '';

  constructor(private http: HttpClient) {}
 
  formatText(command: string) {
    document.execCommand(command, false, '');
  }

  undo() {
    document.execCommand('undo', false, '');
  }

  redo() {
    document.execCommand('redo', false, '');
  }

  onSubmit() {
    const content = this.editor.nativeElement.innerHTML.trim();
    const imageFile = this.inputImage.nativeElement.files[0];

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('category', this.category);
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    this.http.post('http://localhost:5000/api/health-tips/upload', formData).subscribe({
      next: (res) => {
        alert('✅ Tip submitted successfully');
        console.log(res);
      },
      error: (err) => {
        console.error('❌ Submission failed', err);
      },
    });
  }
}

