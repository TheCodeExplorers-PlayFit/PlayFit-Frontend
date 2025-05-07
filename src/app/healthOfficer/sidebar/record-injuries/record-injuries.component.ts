// import { CommonModule, NgFor } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-record-injuries',
//   imports: [CommonModule],
//   templateUrl: './record-injuries.component.html',
//   styleUrl: './record-injuries.component.css'
// })
// export class RecordInjuriesComponent {
//   marginLeft = '300px';
//   marginTop = '78px';
//   marginLeft1 = '100px';
//   contentMarginLeft : string = '250px';
//   barWidth = '480px';
//   bgColor = '#f8f8f8';
//   placeholder1 : string = 'Enter player name';
//   placeholder2 : string = 'Enter player ID';
//   placeholder3 : string = 'Enter player age';
//   placeholder4 : string = 'Enter your name';
//   idSize : number = 8;
//   textBlueColor : string = '#333399';
//   primaryColor : string = '#000080';
//   bgColor1 : string = '#E6E6F2';

//   injuryTypes : string[] = ["Traumatic Injuries","Soft Tissue Injuries","Overuse Injuries"," Internal Injuries","Head and Spinal Cord Injuries","Sports and Exercise Injuries"];
//   injuryServerity : string[] = ["Minor","Moderate","Severe","Critical"];
//   injuryCause : string[] = ["Traumatic Injuries (Sudden Impact)","Mechanical Injuries (Repetitive Strain/Overuse)","Psychological and Internal Injuries"];
// }

import { Component } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InjuryService } from '../../../services/injury/injury.service';


@Component({
  selector: 'app-record-injuries',
  standalone: true,
  imports:[CommonModule, ReactiveFormsModule],
  templateUrl: './record-injuries.component.html',
  styleUrl: './record-injuries.component.css'
})
export class RecordInjuriesComponent {
  marginTop = '22px';
  primaryColor : string = '#000080';
  
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

  constructor(private fb: FormBuilder, private injuryService: InjuryService) {
    this.injuryForm = this.fb.group({
      player_name: ['', Validators.required],
      player_id: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1)]],
      date_of_injury: ['', Validators.required],
      time_of_injury: ['', Validators.required],
      type_of_injury: ['', Validators.required],
      injury_severity: ['', Validators.required],
      first_aid_given: [false, Validators.required],
      health_officer_name: ['', Validators.required],
      treatment_plan: ['']
    });
  }

  submitInjury() {
    if (this.injuryForm.valid) {
      this.injuryService.createInjury(this.injuryForm.value).subscribe({
        next: res => console.log('Injury record created:', res),
        error: err => console.error('Error creating injury record:', err)
      });
    }
  }
}

