import { Component, OnInit } from '@angular/core';
import { LombardService } from '../../../shared/services/lombard.service';
import { Observable, switchMap, tap,map,of } from 'rxjs';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../../shared/services/product.service';
import { trigger,transition,style,animate } from '@angular/animations';

import { NgbModal, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailComponent } from '../../components/modals/product-detail/product-detail.component';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-pawnshop-detail',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './pawnshop-detail.component.html',
  styleUrl: './pawnshop-detail.component.scss'
})
export class PawnshopDetailComponent implements OnInit{

  id:string;
  pawnShop:PawnshopProfile;
  product:Product;

  user:User;

  pawnShop$: Observable<PawnshopProfile>;
  products$: Observable<(Product & { open?: boolean })[]> = of([]);
  favoriteItems$: Observable<Product[]> = of([]);

  currentTime = new Date();
  isOpenNow = false;

  favoriteItems:any[] = [];

  constructor(
    private lombardService:LombardService,
    private route:ActivatedRoute,
    private productService:ProductService,
    private modalService: NgbModal,
    private authService:AuthService,
    private userService:UserService
  ){

  }

  ngOnInit(): void {

    this.authService.currentUser$.subscribe(
      (user) => {
        this.user = user;
        if(user._id){
          this.favoriteItems$ = this.userService.getFavoriteItems(user._id);
          this.favoriteItems$.subscribe(fav => {
            this.favoriteItems = fav;
            console.log(this.favoriteItems,'dasdasdasda')
          })
        }
      }
    )



    this.id = this.route.snapshot.paramMap.get('id')!;

    if(this.id){
      this.pawnShop$ = this.lombardService.getLombardById(this.id)
      
      this.pawnShop$.subscribe(profile => {
        this.pawnShop = profile;
      });

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
    this.products$ = this.pawnShop$.pipe(
      switchMap(profile => this.productService.getProductsByOwner(profile._id)),
      tap(products => console.log('products of pawshop', products))
    )
  }


  openProductDetail(product: Product){
    const modalRef = this.modalService.open(ProductDetailComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.product = product;
    modalRef.componentInstance.pawnshop = this.pawnShop;

  }

   loadFavorites(){
    if(this.user){
      this.userService.getFavoriteItems(this.user._id).subscribe({
        next: (res) => (this.favoriteItems = res),
        
        error: (err) => console.error(err),
      });
      console.log(this.favoriteItems)
    }
  }

  toggleFavoriteItem(productId: string, event: MouseEvent): void {
    event.stopPropagation(); // чтобы не срабатывал click на карточке
    if (!this.user || !this.user._id) return;

    const isFavorite = this.user.favoriteItems?.includes(productId);

    const req$ = isFavorite
      ? this.userService.removeFavoriteItem(this.user._id, productId)
      : this.userService.addFavoriteItem(this.user._id, productId);

    req$.subscribe({
      next: (res) => {
        console.log('✅ Ответ от сервера:', res);
        if (isFavorite) {
          this.user.favoriteItems = this.user.favoriteItems.filter(id => id !== productId);
        } else {
          this.user.favoriteItems = [...(this.user.favoriteItems || []), productId];
        }
      },
      error: (err) => console.error('Ошибка при обновлении избранного:', err),
    });
  }


}
