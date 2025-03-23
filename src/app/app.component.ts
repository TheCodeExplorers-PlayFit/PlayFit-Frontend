import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from "./stadium-owner/sidebar/sidebar.component";
import { SignInFormComponent } from "./stadium-owner/sign-in-form/sign-in-form.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Sports-Management-System';
}
