import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stadium-detail',
  standalone: true,
  templateUrl: './stadium-detail.component.html',
  styleUrl: './stadium-detail.component.css'
})
export class StadiumDetailComponent implements OnInit {
  stadiumName: string | null = null;
  stadiumDetails: any = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.stadiumName = params.get('stadiumName');
      this.loadStadiumDetails(this.stadiumName);
    });
  }

  loadStadiumDetails(name: string | null): void {
    const stadiums: any = {
      'YMB Sports Club - Rawathawaththa': {
        name: 'YMB Sports Club - Rawathawaththa',
        description: 'YMB Sports Club in Rawathawaththa is a community-focused sports facility offering a variety of sports for athletes of all skill levels. The club promotes talent development, sportsmanship, and a healthy lifestyle in a welcoming environment.',
        facilities: [
          'Cricket Grounds – Ideal for casual play and competitive tournaments with well-maintained pitches.',
          'Volleyball Courts – Spacious courts for team play and training.',
          'Badminton Courts – High-quality courts for competitive and casual games.',
          'Basketball Courts – Designed for training, practice, and competitive play.',
          'Swimming Pool – A well-maintained pool for recreational swimming and training.',
          'Karate Training Spaces – Areas dedicated to building strength and self-defense skills.',
          'Weightlifting Area – Fully equipped for strength training and fitness.',
          'Table Tennis – For both friendly games and competitive play.',
          'Chess Section – A quiet space for strategic games and tournaments.',
          'Athletic Track – Designed for running, jumping, and field events.'
        ],
        images: ['https://i.postimg.cc/vxT7NY82/download-3.jpg']
      },
      'Galaxy Sports League-katubedda': {
        name: 'Galaxy Sports League - Katubedda',
        description: 'Galaxy Sports League in Katubedda provides top-class facilities for various sports and training programs. The stadium is designed to host regional and national tournaments with modern amenities.',
        facilities: [
          'Football Ground – High-quality turf for practice and matches.',
          'Indoor Basketball Court – Equipped with professional-grade flooring and hoops.',
          'Swimming Pool – Olympic-sized pool for training and competitions.',
          'Gym & Fitness Center – Fully equipped with modern machines and weights.',
          'Yoga & Wellness Center – Dedicated space for yoga and relaxation activities.',
          'Tennis Courts – Professional courts for training and tournaments.',
          'Boxing Arena – Training space for amateur and professional boxing.',
          'Table Tennis Section – Multiple tables for players of all levels.',
          'Athletics Track – Standard track for running and field events.'
        ],
        images: ['https://i.postimg.cc/vxT7NY82/download-3.jpg']
      }
    };

    this.stadiumDetails = stadiums[name || ''] || null;
  }
}
