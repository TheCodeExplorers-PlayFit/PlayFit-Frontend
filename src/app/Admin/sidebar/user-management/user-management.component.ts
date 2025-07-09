import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { UserService, User } from '../../../services/user/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  searchTerm: string = '';
  selectedRole: string = 'all';
  users: User[] = [];
  filteredUsers: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'role', 'actions'];
  totalCount: number = 0;
  roleCounts: { player: number; coach: number; stadiumOwner: number; medicalOfficer: number } = {
    player: 0,
    coach: 0,
    stadiumOwner: 0,
    medicalOfficer: 0,
  };
  filteredTotalCount: number = 0;
  filteredRoleCounts: { player: number; coach: number; stadiumOwner: number; medicalOfficer: number } = {
    player: 0,
    coach: 0,
    stadiumOwner: 0,
    medicalOfficer: 0,
  };

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data.map((user) => ({
            ...user,
            name: `${user.first_name} ${user.last_name}`, // Compute name
          }));
          this.totalCount = response.totalCount || this.users.length;
          this.roleCounts = response.roleCounts || {
            player: 0,
            coach: 0,
            stadiumOwner: 0,
            medicalOfficer: 0,
          };
          this.filterUsers();
        }
      },
      error: (error) => {
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
      },
    });
  }
  // Filter users based on search term and role
  filterUsers(): void {
    this.filteredUsers = this.users.filter((user) => {
      const matchesSearch = user.first_name
        .toLowerCase()
        .startsWith(this.searchTerm.toLowerCase());
      const matchesRole =
        this.selectedRole === 'all' || user.role === this.selectedRole;
      return matchesSearch && matchesRole;
    });

// Calculate filtered counts based on filteredUsers array and validity
    this.filteredTotalCount = this.filteredUsers.length;
    this.filteredRoleCounts = this.filteredUsers.reduce(
      (acc, user) => {
        if (user.role === 'player') acc.player++;
        if (user.role === 'coach') acc.coach++;
        if (user.role === 'stadiumOwner') acc.stadiumOwner++;
        if (user.role === 'medicalOfficer') acc.medicalOfficer++;
        return acc;
      },
      { player: 0, coach: 0, stadiumOwner: 0, medicalOfficer: 0 }
    );
  }

  onSearchChange(): void {
    this.filterUsers();
  }

  onRoleChange(): void {
    this.filterUsers();
  }

  viewProfile(userId: number): void {
    this.snackBar.open('Profile view not implemented yet', 'Close', {
      duration: 3000,
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          if (response.success) {
            this.users = this.users.filter((user) => user.id !== userId);
            this.filterUsers();
            this.snackBar.open('User deleted successfully', 'Close', {
              duration: 3000,
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
        },
      });
    }
  }
}