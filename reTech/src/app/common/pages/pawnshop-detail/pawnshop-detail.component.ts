import { Component, OnInit } from '@angular/core';
import { LombardService } from '../../../shared/services/lombard.service';
import { Observable } from 'rxjs';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pawnshop-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pawnshop-detail.component.html',
  styleUrl: './pawnshop-detail.component.scss'
})
export class PawnshopDetailComponent implements OnInit{

  id:string;

  pawnShop$:Observable<PawnshopProfile>;

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
  }



}
