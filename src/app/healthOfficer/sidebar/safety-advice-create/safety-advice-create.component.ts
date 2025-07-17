import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HealthTipsService } from '../../../services/healthtips/health-tips.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-safety-advice-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './safety-advice-create.component.html',
  styleUrl: './safety-advice-create.component.css'
})
export class SafetyAdviceCreateComponent implements OnInit {
  @ViewChild('editor') editor!: ElementRef;
  @ViewChild('inputImage') inputImage!: ElementRef;

  title = '';
  category = '';
  selectedImage: string | null = null;
  submitting = false;
  isDragOver = false;

  editMode = false;
  tipId!: number;

  categoryList: string[] = [
    "Public Health & Safety",
    "Injury Prevention & First Aid",
    "Mental Health & Well-being",
    "Nutrition & Diet",
    "Chronic Disease Management",
    "Fitness & Physical Activity",
    "Workplace & Occupational Health"
  ];

  constructor(
    private healthTipsService: HealthTipsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.editMode = true;
        this.tipId = +idParam;
        this.loadTipData(this.tipId);
      }
    });
  }

  loadTipData(id: number) {
    this.healthTipsService.getHealthTipById(id).subscribe({
      next: (res) => {
        const data = res.data;
        this.title = data.title;
        this.category = data.category;
        this.selectedImage = data.image_url;
        this.editor.nativeElement.innerHTML = data.content;
      },
      error: (err) => {
        console.error('Error loading tip', err);
        alert('❌ Failed to load tip data.');
      }
    });
  }

  formatText(command: string) {
    document.execCommand(command, false);
    this.editor.nativeElement.focus();
  }

  onContentChange() {}

  onPaste(event: ClipboardEvent) {
    setTimeout(() => {
      const content = this.editor.nativeElement.innerHTML;
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

      const user = this.authService.getUser();
      if (!user || !user.id) {
        alert('❌ Unable to identify logged-in health officer.');
        this.submitting = false;
        return;
      }

      const healthTipData = {
        title: this.title,
        category: this.category,
        content,
        image_url: uploadedImageUrl || this.selectedImage || null,
        healthOfficer_id: user.id  // ✅ dynamic ID from AuthService
      };

      const submitObservable = this.editMode
        ? this.healthTipsService.updateHealthTip(this.tipId, healthTipData)
        : this.healthTipsService.createHealthTip(healthTipData);

      submitObservable.subscribe({
        next: (res) => {
          alert(this.editMode ? '✅ Tip updated successfully' : '✅ Tip published successfully');
          this.onCancel();
          this.submitting = false;
          this.router.navigate(['/health/safety-advice']);
        },
        error: (err) => {
          console.error('❌ Failed to submit tip', err);
          alert('❌ Submission failed. Please try again.');
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
