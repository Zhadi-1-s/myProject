import { CommonModule,isPlatformBrowser } from '@angular/common';
import { Component, OnInit,Inject,PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable,of,combineLatest,map, filter, tap, switchMap,startWith } from 'rxjs';
import { Product } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../../shared/services/product.service';
import { RouterModule } from '@angular/router';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailComponent } from '../../components/modals/product-detail/product-detail.component';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { LombardService } from '../../../shared/services/lombard.service';
import { TranslateModule } from '@ngx-translate/core';
import {NgxSliderModule,Options} from '@angular-slider/ngx-slider'


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule,TranslateModule,NgxSliderModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {

  user:User;
  
  pawnshop:PawnshopProfile;
  products$:Observable<Product[]>;
  filteredProducts$:Observable<Product[]>;
  searchTerm$ = new BehaviorSubject<string>('');

  appliedFilters$ = new BehaviorSubject<string[]>([])

  isBrowser = false;

  sliderMinOptions: Options = {
    floor: 0,
    ceil: 500000,
    showTicks: false,
    showTicksValues: false
  };

  sliderMaxOptions: Options = {
    floor: 0,
    ceil: 500000
  };

  toogleFilterBlock: boolean = false;

  searchHelpItemsList: string[] = [
    'Iphone',
    'Samsung',
    'Xiaomi',
    'Laptop',
    'Headphones',
    'Camera',
    'Watch',
    'Tablet'
  ]

  priceFrom: number | null = null;
  priceTo: number | null = null;
  priceSort: 'asc' | 'desc' | '' = '';

  constructor(
    private productService :ProductService,
    private modalService: NgbModal,
    private authService:AuthService,
    private pawnShopService :LombardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){

  }

  ngOnInit() {
    console.log('ngOnInit start');

    this.isBrowser = isPlatformBrowser(this.platformId);

    // Загружаем товары и отслеживаем юзера
    this.products$ = combineLatest([
      this.productService.getProcutsList().pipe(
        tap(items => console.log('All products loaded:', items))
      ),
      this.authService.currentUser$.pipe(
        startWith(null),
        tap(user => this.user = user)
      )
    ]).pipe(
      switchMap(([items,user]) => {
        if(user?._id){
          return this.pawnShopService.getLombardByUserId(user?._id).pipe(
            map(pawnshop => {
              this.pawnshop = pawnshop;

              if(pawnshop){
                return items.filter(
                  s => s.status === 'active' && s.ownerId !== pawnshop._id
                );
              }
              
              
              return items.filter(p => p.status === 'active');
            })
          )
        }
        else {
          return of(items.filter(p => p.status === 'active'));
        }
      })
    );

    // Фильтр поиска
    this.filteredProducts$ = combineLatest([
      this.products$,
      this.searchTerm$
    ]).pipe(
      map(([items, term]) => {
        const result = items.filter(p =>
          p.title.toLowerCase().includes(term.toLowerCase())
        );
        console.log(`Search term: "${term}", matched products:`, result);
        return result;
      })
    );
  }

  applyFilters(){}

  onSearchChange(value:string){
    this.searchTerm$.next(value);
  }

  openProductDetails(item:Product){
    const modalRef = this.modalService.open(ProductDetailComponent)

    modalRef.componentInstance.product = item;
    modalRef.componentInstance.user = this.user;
    modalRef.componentInstance.pawnshop = this.pawnshop;
  }

}
