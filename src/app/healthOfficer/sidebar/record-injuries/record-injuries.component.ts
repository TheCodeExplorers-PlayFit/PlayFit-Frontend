import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-record-injuries',
  imports: [CommonModule],
  templateUrl: './record-injuries.component.html',
  styleUrl: './record-injuries.component.css'
})
export class RecordInjuriesComponent {
  marginLeft = '300px';
  marginTop = '78px';
  marginLeft1 = '100px';
  contentMarginLeft : string = '250px';
  barWidth = '480px';
  bgColor = '#f8f8f8';
  placeholder1 : string = 'Enter player name';
  placeholder2 : string = 'Enter player ID';
  placeholder3 : string = 'Enter player age';
  placeholder4 : string = 'Enter your name';
  idSize : number = 8;
  textBlueColor : string = '#333399';
  primaryColor : string = '#000080';
  bgColor1 : string = '#E6E6F2';

  injuryTypes : string[] = ["Traumatic Injuries","Soft Tissue Injuries","Overuse Injuries"," Internal Injuries","Head and Spinal Cord Injuries","Sports and Exercise Injuries"];
  injuryServerity : string[] = ["Minor","Moderate","Severe","Critical"];
  injuryLocation : string[] = ["Head and Face"," Neck and Spine","Upper Body","Chest and Abdomen","Pelvis and Groin","Lower Body"];
  injuryCause : string[] = ["Traumatic Injuries (Sudden Impact)","Mechanical Injuries (Repetitive Strain/Overuse)","Psychological and Internal Injuries"];
}
