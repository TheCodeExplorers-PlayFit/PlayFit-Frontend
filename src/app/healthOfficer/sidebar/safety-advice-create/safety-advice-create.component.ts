import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild  } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-safety-advice-create',
  imports: [CommonModule,RouterLink,RouterOutlet,RouterLinkActive],
  templateUrl: './safety-advice-create.component.html',
  styleUrl: './safety-advice-create.component.css'
})
export class SafetyAdviceCreateComponent {
 @ViewChild('editor') editor!: ElementRef; // Reference to contenteditable div

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
 
  formatText(command: string) {
    document.execCommand(command, false, '');
  }

  undo() {
    document.execCommand('undo', false, '');
  }

  redo() {
    document.execCommand('redo', false, '');
  }

  
}
