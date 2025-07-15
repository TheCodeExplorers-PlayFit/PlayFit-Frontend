import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HealthTipsService } from '../../../services/healthtips/health-tips.service';

@Component({
  selector: 'app-safety-advice-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './safety-advice-create.component.html',
  styleUrl: './safety-advice-create.component.css'
})
export class SafetyAdviceCreateComponent {
  @ViewChild('editor') editor!: ElementRef;
  @ViewChild('inputImage') inputImage!: ElementRef;

  title = '';
  category = '';
  selectedImage: string | null = null;
  submitting = false;
  isDragOver = false;

  categoryList: string[] = [
    "Public Health & Safety",
    "Injury Prevention & First Aid",
    "Mental Health & Well-being",
    "Nutrition & Diet",
    "Chronic Disease Management",
    "Fitness & Physical Activity",
    "Workplace & Occupational Health"
  ];

  constructor(private healthTipsService: HealthTipsService) {}

  formatText(command: string) {
    document.execCommand(command, false);
    this.editor.nativeElement.focus();
  }

  onContentChange() {
    // Handle content changes if needed
  }

  onPaste(event: ClipboardEvent) {
    // Handle paste events - you might want to clean HTML
    setTimeout(() => {
      const content = this.editor.nativeElement.innerHTML;
      // Process pasted content if needed
    }, 0);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processImageFile(files[0]);
    }
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processImageFile(input.files[0]);
    }
  }

  processImageFile(file: File) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedImage = null;
    this.inputImage.nativeElement.value = '';
  }

  onCancel() {
    // Reset form or navigate away
    this.title = '';
    this.category = '';
    this.selectedImage = null;
    this.editor.nativeElement.innerHTML = '';
    this.inputImage.nativeElement.value = '';
  }

  isFormValid(): boolean {
    const content = this.editor?.nativeElement?.innerHTML?.trim();
    return !!(this.title && this.category && content && content !== '');
  }

  async onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.submitting = true;
    const content = this.editor.nativeElement.innerHTML.trim();
    const imageFile = this.inputImage.nativeElement.files[0];
  

    try {
      let uploadedImageUrl = '';
      
      if (imageFile) {
        const cloudRes = await this.healthTipsService.uploadFileToCloudinary(imageFile).toPromise();
        uploadedImageUrl = cloudRes.secure_url;
      }

      const healthTipData = {
        title: this.title,
        category: this.category,
        content,
        image_url: uploadedImageUrl || null,
        healthOfficer_id:2
      };

      this.healthTipsService.createHealthTip(healthTipData).subscribe({
        next: (res) => {
          alert('✅ Tip published successfully');
          this.onCancel(); // Reset form
          this.submitting = false;
        },
        error: (err) => {
          console.error('❌ Publication failed', err);
          alert('❌ Failed to publish tip. Please try again.');
          this.submitting = false;
        },
      });

    } catch (err) {
      console.error('❌ Image upload failed', err);
      alert('❌ Image upload failed. Please try again.');
      this.submitting = false;
    }
  }
}