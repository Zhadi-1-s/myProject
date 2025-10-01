import { Component,OnInit } from '@angular/core';
import { NavItem } from '../../../shared/interfaces/navbar.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'fa-regular fa-house', route: '/dashboard' },
    { label: 'Lombards', icon: 'fa-regular fa-building', route: '/courses' },
    { label: 'Assistent', icon: 'bi bi-robot', route: '/assignments'},
    { label: 'Help', icon: 'fa-solid fa-circle-question', route: '/calendar' }
  ];

  constructor() { }

  searchTerm: string = '';
  filteredItems: NavItem[] = [];

  ngOnInit() {
    this.filteredItems = this.navItems; // изначально все пункты
  }

  onSearchChange() {
    this.filteredItems = this.navItems.filter(item =>
      item.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  
}
