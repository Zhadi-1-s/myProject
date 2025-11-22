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

import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule,TranslateModule,NgxSliderModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  animations:[
    trigger('filterAnimation', [
      state(
        'closed',
        style({
          height: '0',
          opacity: 0,
          overflow: 'hidden',
         
        })
      ),
      state(
        'open',
        style({
          height: '*',
          opacity: 1,
          overflow: 'hidden'
        })
      ),
      transition('closed <=> open', animate('200ms ease'))
    ])
  ]
})
export class ProductsListComponent implements OnInit {

  user:User;
  
  pawnshop:PawnshopProfile;
  products$:Observable<Product[]>;
  filteredProducts$:Observable<Product[]>;
  searchTerm$ = new BehaviorSubject<string>('');
  productBase$:Observable<Product[]>

  appliedFilters$ = new BehaviorSubject<string[]>([])

  isBrowser = false;
  isLoading = true;

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

    // 1. Базовое получение всех продуктов без фильтров
    const baseProducts$ = combineLatest([
      this.productService.getProcutsList(),
      this.authService.currentUser$.pipe(startWith(null))
    ]).pipe(
      switchMap(([items, user]) => {

        // Сохраняем юзера
        this.user = user;

        // Если нет авторизации
        if (!user?._id) {
          return of(items.filter(p => p.status === 'active'));
        }

        // Получаем ломбард пользователя
        return this.pawnShopService.getLombardByUserId(user._id).pipe(
          map(pawnshop => {
            this.pawnshop = pawnshop;

            if (pawnshop) {
              // Убираем товары своего ломбарда
              return items.filter(
                p => p.status === 'active' && p.ownerId !== pawnshop._id
              );
            }

            return items.filter(p => p.status === 'active');
          })
        );
      }),
      tap(items => console.log('Base products:', items))
    );

    this.productBase$ = baseProducts$
    this.productBase$.pipe(tap(() => this.isLoading = false)).subscribe();

    // 2. products$ с фильтрами цены + сортировкой
    this.products$ = combineLatest([
      this.productBase$,
      this.appliedFilters$
    ]).pipe(
      map(([items, _filters]) => {
        let result = [...items];

        // Фильтр по цене
        if (this.priceFrom != null) {
          result = result.filter(p => p.price >= this.priceFrom);
        }
        if (this.priceTo != null) {
          result = result.filter(p => p.price <= this.priceTo);
        }

        // Сортировка
        if (this.priceSort === 'asc') {
          result = result.sort((a, b) => a.price - b.price);
        }
        if (this.priceSort === 'desc') {
          result = result.sort((a, b) => b.price - a.price);
        }

        return result;
      })
    );

    // 3. Поиск по названию
    this.filteredProducts$ = combineLatest([
      this.products$,
      this.searchTerm$
    ]).pipe(
      map(([items, term]) =>
        items.filter(p =>
          p.title.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }


  applyFilters(){
    const filters: string[] = [];

    if (this.priceFrom != null) {
      filters.push(`Цена от: ${this.priceFrom.toLocaleString()} ₸`);
    }
    if (this.priceTo != null) {
      filters.push(`Цена до: ${this.priceTo.toLocaleString()} ₸`);
    }
    if (this.priceSort) {
      filters.push(`Сортировка: ${this.priceSort === 'asc' ? 'По возрастанию' : 'По убыванию'}`);
    }
    this.appliedFilters$.next(filters)

  }

  clearFilters() {
    this.priceFrom = null;
    this.priceTo = null;
    this.priceSort = '';
    this.appliedFilters$.next([]);
    this.onSearchChange(''); 
    this.applyFilters(); 
  }

  onHelpItemClick(item:string){
    const current = this.appliedFilters$.value;
    if (!current.includes(item)) {
      this.appliedFilters$.next([...current, item]);
    }
  }

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
