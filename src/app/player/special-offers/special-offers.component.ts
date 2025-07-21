import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'app/services/auth/auth.service';

@Component({
  selector: 'app-special-offers',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './special-offers.component.html',
  styleUrls: ['./special-offers.component.css']
})
export class SpecialOffersComponent implements OnInit {
  private apiUrl = 'http://localhost:5000/api/player-leaderboards';
  availablePackages: any[] = [];
  assignedPackages: any[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchPackages();
  }

  fetchPackages(): void {
    const playerId = this.authService.getPlayerId();
    if (!playerId) {
      this.router.navigate(['login']);
      return;
    }

    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    this.http.get(`${this.apiUrl}/packages`, { params: { playerId: playerId.toString() }, headers }).subscribe({
      next: (response: any) => {
        this.availablePackages = response.availablePackages;
        this.assignedPackages = response.assignedPackages;
      },
      error: (error) => {
        console.error('Error fetching packages:', error);
      }
    });
  }

  assignPackage(packageId: number, price: number): void {
    const playerId = this.authService.getPlayerId();
    if (!playerId) {
      this.router.navigate(['login']);
      return;
    }

    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    this.http.post(`${this.apiUrl}/initiate-package-payment`, { packageId, playerId }, { headers }).subscribe({
      next: (response: any) => {
        const paymentData = response.payment;
        localStorage.setItem('pendingOrderId', paymentData.order_id);
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandbox.payhere.lk/pay/checkout';
        for (const key in paymentData) {
          if (paymentData.hasOwnProperty(key)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentData[key];
            form.appendChild(input);
          }
        }
        document.body.appendChild(form);
        form.submit();

        // Poll for payment confirmation
        setTimeout(() => this.pollPaymentConfirmation(paymentData.order_id, playerId), 5000);
      },
      error: (error) => {
        console.error('Error initiating payment:', error);
      }
    });
  }

  pollPaymentConfirmation(orderId: string, playerId: number): void {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    const maxAttempts = 10;
    let attempts = 0;

    const checkPayment = () => {
      this.http.post(`${this.apiUrl}/confirm-package-assignment`, { order_id: orderId, playerId }, { headers }).subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log(response.message);
            localStorage.removeItem('pendingOrderId');
            this.fetchPackages(); // Refresh packages to update UI
          } else {
            if (attempts < maxAttempts) {
              attempts++;
              setTimeout(checkPayment, 3000);
            } else {
              console.error('Max polling attempts reached');
            }
          }
        },
        error: (error) => {
          console.error('Error confirming package assignment:', error);
          if (attempts < maxAttempts) {
            attempts++;
            setTimeout(checkPayment, 3000);
          } else {
            console.error('Max polling attempts reached');
          }
        }
      });
    };

    checkPayment();
  }
}