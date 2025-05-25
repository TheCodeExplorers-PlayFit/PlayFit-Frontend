import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-player-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-transactions.component.html',
  styleUrl: './player-transactions.component.css'
})
export class PlayerTransactionsComponent implements OnInit {
  transactions: any[] = [];
  selectedTransaction: any = null;
  showModal: boolean = false;
  errorMessage: string = '';
  playerId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.playerId = this.authService.getPlayerId();
    if (this.playerId) {
      this.fetchTransactions();
    } else {
      this.errorMessage = 'Please log in as a player to view transaction history';
    }
  }

  fetchTransactions(): void {
    if (!this.playerId) return;
    this.http.get(`http://localhost:5000/api/transactions/player/${this.playerId}`)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.transactions = response.transactions;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Failed to load transactions';
          }
        },
        error: (error) => {
          console.error('Error fetching transactions:', error);
          this.errorMessage = 'Error fetching transactions: ' + error.message;
        }
      });
  }

  openTransactionModal(transaction: any): void {
    this.selectedTransaction = transaction;
    this.showModal = true;
  }

  closeTransactionModal(): void {
    this.showModal = false;
    this.selectedTransaction = null;
  }
}