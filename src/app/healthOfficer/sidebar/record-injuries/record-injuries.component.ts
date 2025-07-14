import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InjuryService } from '../../../services/injury/injury.service'; // assumes your path
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-record-injuries',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './record-injuries.component.html',
  styleUrl: './record-injuries.component.css'
})
export class RecordInjuriesComponent implements OnInit {
  marginTop = '22px';
  primaryColor: string = '#000080';
  uploading = false;
  blogId: string = '';
  selectedFiles: File[] = [];

  injuryForm: FormGroup;

injuryTypes: string[] = [
  'Traumatic Injuries',
  'Soft Tissue Injuries',
  'Overuse Injuries',
  'Internal Injuries',
  'Head and Spinal Cord Injuries',
  'Sports and Exercise Injuries'
];

injuryServerity: string[] = [
  'Minor',
  'Moderate',
  'Severe',
  'Critical'
];

injuryCause: string[] = [
  'Traumatic Injuries (Sudden Impact)',
  'Mechanical Injuries (Repetitive Strain/Overuse)',
  'Psychological and Internal Injuries'
];
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private injuryService: InjuryService
  ) {
    this.injuryForm = this.fb.group({
      player_name: ['', Validators.required],
      player_id: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1)]],
      date_of_injury: ['', Validators.required],
      time_of_injury: ['', Validators.required],
      type_of_injury: ['', Validators.required],
      injury_severity: ['', Validators.required],
      first_aid_given: [false, Validators.required],
      health_officer_id: ['', Validators.required],
      treatment_plan: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogId = id;
      this.fetchPlayerDetails(id);
    }
  }

  fetchPlayerDetails(id: string) {
    this.http.get<any>(`http://localhost:5000/api/appointments/details/${id}`)
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            const player = res.data;

            // ✅ Auto-fill fields
            this.injuryForm.patchValue({
              player_name: `${player.first_name} ${player.last_name}`,
              player_id: player.player_id,
              age: player.age
            });
          }
        },
        error: (err) => {
          console.error('Failed to fetch player details', err);
        }
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles = files.slice(0, 5);

      if (files.length > 5) {
        alert('Maximum 5 files allowed. Only the first 5 files have been selected.');
      }
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  async submitInjury() {
    if (this.injuryForm.valid) {
      try {
        this.uploading = true;
        let fileUrls: string[] = [];

        for (const file of this.selectedFiles) {
          const res = await this.injuryService.uploadFileToCloudinary(file).toPromise();
          fileUrls.push(res.secure_url);
        }

        this.uploading = false;

        const formValue = {
          ...this.injuryForm.value,
          medical_files: fileUrls.join(',')
        };

        this.injuryService.createInjury(formValue).subscribe({
          next: res => {
            console.log('Injury record created:', res);
            this.injuryForm.reset();
            this.selectedFiles = [];
          },
          error: err => console.error('Error creating injury record:', err)
        });

      } catch (err) {
        this.uploading = false;
        console.error('File upload failed:', err);
      }
    }
  }
}
