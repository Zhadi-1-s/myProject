import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {

  user:User;
  
  pawnshopId:string;
  products$:Observable<Product[]>;
  filteredProducts$:Observable<Product[]> = of([])
  searchTerm$ = new BehaviorSubject<string>('');

  appliedFilters$ = new BehaviorSubject<string[]>([])

  constructor(
    private productService :ProductService,
    private modalService: NgbModal,
    private authService:AuthService,
    private pawnShopService :LombardService
  ){

  }

  ngOnInit() {
    console.log('ngOnInit start');

    // Загружаем товары и отслеживаем юзера
    this.products$ = combineLatest([
      this.productService.getProcutsList().pipe(
        tap(items => console.log('All products loaded:', items))
      ),
      this.authService.currentUser$.pipe(
        startWith(null),
        tap(user => console.log('Current user:', user))
      )
    ]).pipe(
      map(([items, user]) => {
        let filtered;
        if(user?._id){
          filtered = items.filter(p => p.status === 'active' && p.ownerId !== user._id);
          console.log('Filtered products (excluding user):', filtered);
        } else {
          filtered = items.filter(p => p.status === 'active');
          console.log('Filtered products (all active):', filtered);
        }
        return filtered;
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



  onSearchChange(event){
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm$.next(value);
  }

  openProductDetails(item:Product){
    const modalRef = this.modalService.open(ProductDetailComponent)

    modalRef.componentInstance.product = item;
    modalRef.componentInstance.user = this.user;
  }

}
