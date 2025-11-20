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
  
  pawnshop:PawnshopProfile;
  products$:Observable<Product[]>;
  filteredProducts$:Observable<Product[]>;
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
        tap(user => this.user = user)
      )
    ]).pipe(
      switchMap(([items,user]) => {
        if(user?._id){
          return this.pawnShopService.getLombardByUserId(user?._id).pipe(
            map(pawnshop => {
              this.pawnshop = pawnshop;
              console.log(pawnshop)
              const filtered = items.filter(
                s => s.status === 'active' && pawnshop._id !== s.ownerId
              );
              console.log('Filtered products (excluding own):', filtered);
              return filtered;
            })
          )
        }
        else {
          const filtered = items.filter(p => p.status === 'active');
          console.log('Filtered products (all active):', filtered);
          return of(filtered); // Wrap the array in 'of' to return an Observable<Product[]>
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
