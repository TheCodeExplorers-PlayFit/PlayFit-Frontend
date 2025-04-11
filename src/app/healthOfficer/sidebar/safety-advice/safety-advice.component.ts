import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-safety-advice',
  imports: [CommonModule,RouterLink,RouterLinkActive,RouterOutlet],
  templateUrl: './safety-advice.component.html',
  styleUrl: './safety-advice.component.css'
})
export class SafetyAdviceComponent {
  search : string = 'Search safety tips...';
  marginLeft = '300px';
  marginTop = '78px';
  primaryColor : string = '#000080';
  cards=[
    {
      title:'Importance of Proper Nutrition',
      description : 'Proper nutrition fuels performance. Learn which foods to eat and what to avoid for better recovery.',
      image : 'https://media-hosting.imagekit.io//9984a066ed5546e9/download.jpg?Expires=1836044878&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=QkwOD9MaKHkkVspEzZH7pqgenu2zW2QV7aIuP2K5oElDdcWxBdX2mPr-~~lYZqE9r13nbnZ26mR48nyME0m1i9DRXBFvsOLI~shfB0UEwhw0JXg~KlF6ndsDVhWocN56qJOBhwdTS4H2W7vkicrctxTOS2staQyu0H4sjQem7FTfvsS39d3CjcrIeGKNJyNmmSFnxE9EVI37KRbAvXNC1iJpWCWqRLsVtcjOMYkW7VYVopND0ceezkyyx8OaS-f~tvqWupL28C1vrjl8EMZo1GmF7t-gzW1qoG--TFIkSW1MQrpujq0feqegOgfmL2evz7CfPDuz-9Dcqk9o1DnsVQ__',
      name : 'nutrition',
      updatedate : 'Last updated 3 mins ago'
    },
    {
      title:'Quick First Aid for Sports Injuries',
      description : 'Learn how to handle minor injuries like bruises, cuts, and sprains before professional help arrives.',
      image : 'https://media-hosting.imagekit.io//90ebbe3a80814a76/5b51913996278764d03189c313867908.jpg?Expires=1836050293&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ZBfV2BvdBm65Nr8Up6Cocnri~hRGQmBGAJDLgHZDLVDmVc6TLaibpL-T-KOOzkZDw78bAInSXaXdyKOMSl8YHemujmz0LFW5VNT3uG1k4T5osCBmpFDgDbrV5FQjYq7UZXIriG-QvxZEhnpmHgGirvRFShBKYbneOZAbrLCWCDOJwDqDD3bZVMJjS3Xbje18w7ek05qFJvTB9noMIZhjSPdf~O5C6lN-tP4K2xpUiiLolf54wqXEJ0Ij52ahNcHKW2M-kETW6HRXsawZd~U0-JpgUj29PTOVZqfG9aOP-uBZn9o-3ntbVFubZbURoETxnvYC9j6ECCJ~LxPCk4AF9Q__',
      name : 'first aid',
      updatedate : 'Last updated 3 mins ago'
    },
    {
      title:'How Poor Nutrition Affects Athletes',
      description : 'Lack of proper nutrients can lead to fatigue, slow recovery, and increased injury risk.',
      image : 'https://media-hosting.imagekit.io//434dda20ec2848ab/33%20-%20Does%20Poor%20Nutrition%20Increase%20the%20Risk%20of%20Sports%20Injury_.jpg?Expires=1836050798&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=PW7MbqHn3iB~9REGux8QRXXA5AyZJuocL3GcAIJ2BGNAWAzxndRB4el3Vehpbs83JY8GrBnzDQmVWo8RamoVUBZM2qYFsuME1AAuIAWogaFWHak~2flHAJbVcJbWyGX~TU5fR9bnO4huxjn5O~5u0EDPBOWXfN4K33DcjLAOzExW9btNGIJTy1qj5CG5G8In~1fTj5ChDsDWvY6wv26GP5IxreXszR~Qq8Lf62SlUFSEQyR1PrjSzPeKuM0KWm-Kf5OxDLE~al5pKdXm04eiK7mzuHYwiSgJaYzOhsFzF-YzQvArDCA8HGIZN0eV2X1UJ8LzbuNgQplA3oX2bcKcCQ__',
      name : 'first aid',
      updatedate : 'Last updated 3 mins ago'
    }
  ]
}
