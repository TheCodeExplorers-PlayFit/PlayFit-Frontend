import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blogs',
  imports: [CommonModule,FormsModule],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
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
