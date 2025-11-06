import { Component, OnInit } from '@angular/core';
import { LombardService } from '../../../shared/services/lombard.service';
import { Observable } from 'rxjs';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ImageViewComponent } from '../../components/image-view/image-view.component';

@Component({
  selector: 'app-pawnshop-detail',
  standalone: true,
  imports: [CommonModule,TranslateModule,ImageViewComponent],
  templateUrl: './pawnshop-detail.component.html',
  styleUrl: './pawnshop-detail.component.scss'
})
export class PawnshopDetailComponent implements OnInit{

  id:string;

  pawnShop$:Observable<PawnshopProfile>;

  currentTime = new Date();
  isOpenNow = false;

  constructor(
    private lombardService:LombardService,
    private route:ActivatedRoute
  ){

  }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id')!;

    if(this.id){
      this.pawnShop$ = this.lombardService.getLombardById(this.id)      
    }

    this.pawnShop$.subscribe(profile => {
      if (profile?.openTime && profile?.closeTime) {
        const now = new Date();
        const [openHour, openMinute] = profile.openTime.split(':').map(Number);
        const [closeHour, closeMinute] = profile.closeTime.split(':').map(Number);

        const open = new Date();
        open.setHours(openHour, openMinute);

        const close = new Date();
        close.setHours(closeHour, closeMinute);

        this.isOpenNow = now >= open && now <= close;
      }
    });
  }

}
