import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-stadium-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './stadium-list.component.html',
  styleUrl: './stadium-list.component.css'
})
export class StadiumListComponent {
  stadiums = [
    {
      name: 'YMB Sports Club - Rawathawaththa',
      description: 'A community-focused club in Rawathawaththa, offering facilities for cricket, volleyball, and badminton.',
      images: ['https://i.postimg.cc/SR7ZjRB4/download-3.jpg']
    },
    {
      name: 'Galaxy Sports League-katubedda',
      description: 'A vibrant club in Katubedde, specializing in football and athletics.',
      images: ['https://i.postimg.cc/Kvxqw7T8/download-1.jpg'  ] 
        },
    {
      name: 'Peak Performance Club-Koralawella',
      description: 'Situated in Koralawella, this club focuses on personal fitness and team sports.',
      images: ['https://i.postimg.cc/7PgtKtfR/download.jpg']
    },
    {
      name: 'Unity Sports Network- Egoda uyana',
      description: 'Located in Egoda Uyana, this club emphasizes inclusivity and various sports activities.',
      images: ['https://i.postimg.cc/Pry3jLbz/download-2.jpg']
    }
  ];
}
