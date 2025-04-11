import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.css']
})
export class SignInFormComponent {
  marginLeft = '0';
  marginTop = '78px';
  marginRight = '100px';
  imageUrl : string = 'https://media-hosting.imagekit.io//afbddd0fda9f46bd/image%208.png?Expires=1836109212&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=L4JtUHtl5O6DcvnUnOD8TGnmZPRS~D~WGsgMPvefh5ZDhMX9-~JSvx7ipPRM9U3nQdU8nJU-qWnuWhg7XizGg59V3cTFIlUK4s04grSX6L~wZRL9O7qLjSYtcXaHfTeUFAdtpxSvgobibmwieWEAR8ixeciNgNvFUjHJQXxhuJEDEmUsBY5liJaSklfhCEGVzIxUerkh8xA4KT6zq7h~r3VSAFNBBZ6qI7Cq3e9YNU~nwtOq8hfFWErp38xU66AeL4ycrcJPN7p0KILGOB4-0qZnQ8ICJbsbmmweMPqlPM2hSJkjAtAsGmnKpfJp1Vq9WHk-br1sFuJyAeFfgbzIWA__' ;
  mobilenum : string = 'Enter your mobile number';
  age : string = 'Enter your age';
  nic : string = 'Enter your NIC number';
  imageHight = '950px';
  imagewidth = '400px';
  primaryColor : string = '#000080';
  contentWidth :string= '600px';
  contentGap : string = '100px';

}