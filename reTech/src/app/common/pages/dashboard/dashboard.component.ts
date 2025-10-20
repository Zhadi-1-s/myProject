import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { CommonModule } from '@angular/common';
import { LombardService } from '../../../shared/services/lombard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  lombardList:PawnshopProfile[];

  constructor(
              private lombardService:LombardService
  ){}

  ngOnInit(){
      this.lombardService.getLombards().subscribe({
        next : (pawnshops) => {
          this.lombardList = pawnshops;
          console.log('this is the pawnshops list');
        },
        error(err) {
            console.error(err.message)
        },
      })
  }

}
