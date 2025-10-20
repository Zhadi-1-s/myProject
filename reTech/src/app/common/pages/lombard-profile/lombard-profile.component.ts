import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../shared/interfaces/user.interface';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { LombardService } from '../../../shared/services/lombard.service';
import { AuthService } from '../../../shared/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditLombardComponent } from '../../components/modals/edit-lombard/edit-lombard.component';
import { Product } from '../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-lombard-profile',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './lombard-profile.component.html',
  styleUrl: './lombard-profile.component.scss'
})
export class LombardProfileComponent implements OnInit{

  profile: PawnshopProfile | null = null;

  items:Product[];

  user:User;

  currentTime: Date = new Date();

  constructor(private lombardService:LombardService,private authService:AuthService,private modalService: NgbModal){}

  

  ngOnInit(){
    this.authService.currentUser$.subscribe(user => {
      this.user = user;

      this.lombardService.getLombardByUserId(user._id).subscribe({
        next : (pawnshop) => {
          this.profile = pawnshop;
          console.log('loading pawnshop', pawnshop)
        },
        error(err) {
          console.error(err.message);
        }
      })
    })
  }

  get isOpenNow(): boolean {
    if (!this.profile?.openTime || !this.profile?.closeTime) return false;
    
    const now = new Date();
    const [openH, openM] = this.profile.openTime.split(':').map(Number);
    const [closeH, closeM] = this.profile.closeTime.split(':').map(Number);
    
    const open = new Date();
    open.setHours(openH, openM, 0);

    const close = new Date();
    close.setHours(closeH, closeM, 0);

    return now >= open && now <= close;
  }

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

  openEditLombard(){
    const modalRef = this.modalService.open(EditLombardComponent,{centered:true})

    modalRef.componentInstance.lombard = this.profile;

    modalRef.result.then(
      (updatedShop:PawnshopProfile) => {
        if(updatedShop){
          this.profile = updatedShop
        }
      },
      () => {}
    )

  }

}
