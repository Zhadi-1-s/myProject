import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { app } from '../../server';
import { NavbarComponent } from './common/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './common/components/topbar/topbar.component';
import { FooterComponent } from './common/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent,CommonModule,TopbarComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'reTech';

  constructor(private router: Router) {}

  sidebarOpen:boolean = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/register');
  }

    onSidebarToggle(isOpen: boolean): void {
      this.sidebarOpen = isOpen
    }


}
