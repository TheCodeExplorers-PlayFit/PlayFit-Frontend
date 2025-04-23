import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stadiums',
  templateUrl: './stadiums.component.html',
  styleUrls: ['./stadiums.component.css']
})
export class StadiumsComponent implements OnInit {
  stadiums: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5000/api/stadiums').subscribe(data => {
      this.stadiums = data;
    });
  }
  marginLeft = '270px';
  marginTop = '78px';
}

