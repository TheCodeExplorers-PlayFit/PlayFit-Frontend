import { Component } from '@angular/core';
import { SidebarComponent } from "./healthOfficer/sidebar/sidebar.component";
import { SignInFormComponent } from './healthOfficer/sign-in-form/sign-in-form.component';


@Component({
  selector: 'app-root',
  imports: [SidebarComponent,SignInFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Sports-Management-System';
  ifRegisted : boolean =true;
}
