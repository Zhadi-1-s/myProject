import { Component,OnInit } from '@angular/core';
import { NavItem } from '../../../shared/interfaces/navbar.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean;

  user: User | null = null;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'fa-regular fa-house', route: '/dashboard' },
    { label: 'Lombards', icon: 'fa-regular fa-building', route: '/courses' },
    { label: 'Assistent', icon: 'bi bi-robot', route: '/assignments'},
    { label: 'Help', icon: 'fa-solid fa-circle-question', route: '/calendar' }
  ];

  constructor(private authService: AuthService) { }

  searchTerm: string = '';
  filteredItems: NavItem[] = [];

  ngOnInit() {
    this.filteredItems = this.navItems; // изначально все пункты
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  onSearchChange() {
    this.filteredItems = this.navItems.filter(item =>
      item.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  
}
