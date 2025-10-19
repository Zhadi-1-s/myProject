import { Component, OnInit ,PLATFORM_ID} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

import { inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';



@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {

  currentLang = 'en';
  user: User;

  isPawnShop:boolean = false;

  private platformId = inject(PLATFORM_ID);

  constructor(
    private router: Router, 
    private translate: TranslateService,
    private authService:AuthService,
    ) {
      if(isPlatformBrowser(this.platformId)) {
        const savedLang = localStorage.getItem('lang') || 'en';
        this.translate.use(savedLang);
        this.currentLang = savedLang;
      }
    }

  ngOnInit(): void {
    // Проверяем, есть ли язык в localStorage
    // if(typeof localStorage !== 'undefined') {
    //   const savedLang = localStorage.getItem('lang');
    //   if (savedLang) {
    //     this.currentLang = savedLang;
    //     this.translate.use(savedLang);
    //   } else {
    //     // иначе используем дефолтный
    //     this.translate.setDefaultLang('en');
    //     this.translate.use('en');
    //   }
    // }
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user && user.role === 'pawnshop') {
        this.isPawnShop = true;
      }
    });
  }

  
  changeLang(lang: string) {
      this.translate.use(lang);
      localStorage.setItem('lang', lang);
      this.currentLang = lang;
    }

  logout() {
    // if(typeof localStorage !== 'undefined'){
    //   localStorage.removeItem('loginToken');
    //   this.router.navigate(['/login']);
    // }
  }
}