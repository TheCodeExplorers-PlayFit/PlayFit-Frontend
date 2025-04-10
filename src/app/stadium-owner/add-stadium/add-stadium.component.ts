import { Component } from '@angular/core';

@Component({
  selector: 'app-add-stadium',
  standalone:true,
  templateUrl: './add-stadium.component.html',
  styleUrls: ['./add-stadium.component.css']
})
export class AddStadiumComponent {
  // You can handle form submission and validations here
  onSubmit() {
    alert('Form submitted successfully!');
  }
}

