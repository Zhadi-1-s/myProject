import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../shared/interfaces/user.interface';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { LombardService } from '../../../shared/services/lombard.service';
@Component({
  selector: 'app-lombard-profile',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './lombard-profile.component.html',
  styleUrl: './lombard-profile.component.scss'
})
export class LombardProfileComponent {

  profile: PawnshopProfile | null = null;

  currentTime: Date = new Date();

  constructor(private lombardService:LombardService){}

  pawnshopOffers: any[] = [];

  // ngOnInit() {
  //   this.authService.currentUser$.subscribe(user => {
  //     this.user = user;
  //     if (user?.role === 'pawnshop') {
  //       this.loadPawnshopOffers();
  //     }
  //   });
  // }

  loadPawnshopOffers() {
    // this.lombardService.getMyOffers().subscribe(offers => {
    //   this.pawnshopOffers = offers;
    // });
  }

  openEditModal(){}

 openAddOfferModal(){}

}
