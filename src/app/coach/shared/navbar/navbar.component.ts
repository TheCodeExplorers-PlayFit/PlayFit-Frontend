import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // You can add any logic here if needed, such as user authentication or dynamic content
  userName: string = 'Sadun Gamage'; // Example user name
}