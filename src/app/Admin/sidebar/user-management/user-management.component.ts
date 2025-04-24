import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  searchTerm: string = '';
  users = [
    {
      id: 1,
      name: 'Kaveesha Fernando',
      email: 'kaveesha@playfit.com',
      phone: '077 123 4567',
      role: 'Coach',
      status: 'Active',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      name: 'Rashmi Perera',
      email: 'rashmi@playfit.com',
      phone: '071 987 6543',
      role: 'Player',
      status: 'Pending',
      photo: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: 3,
      name: 'Anujan Silva',
      email: 'anujan@playfit.com',
      phone: '076 234 5678',
      role: 'Stadium Owner',
      status: 'Suspended',
      photo: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  ];

  get filteredUsers() {
    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
