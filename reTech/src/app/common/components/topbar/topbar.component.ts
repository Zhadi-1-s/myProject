import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit{

  currentLang = 'en';
  user:string; // можно брать из AuthService после логина

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    
  }

  changeLang(lang: string) {
    this.currentLang = lang;
    // здесь можно интегрировать ngx-translate
  }

  logout() {
    localStorage.removeItem('loginToken');
    this.router.navigate(['/login']);
  }

}
