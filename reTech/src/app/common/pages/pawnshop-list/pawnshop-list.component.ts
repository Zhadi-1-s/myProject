import { Component, OnInit } from '@angular/core';
import { Observable,BehaviorSubject,combineLatest,map, switchMap,forkJoin,of,tap } from 'rxjs';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { LombardService } from '../../../shared/services/lombard.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-pawnshop-list',
  standalone: true,
  imports: [CommonModule,TranslateModule, ReactiveFormsModule,FormsModule],
  templateUrl: './pawnshop-list.component.html',
  styleUrl: './pawnshop-list.component.scss'
})
export class PawnshopListComponent implements OnInit{

  lombards$:Observable<PawnshopProfile[]>;
  filteredLombards$: Observable<PawnshopProfile[]>;
  searchTerm$ = new BehaviorSubject<string>('');
  productsOfPawnShop$: Observable<Product[]>;

  activeFilter: 'all' | 'active' | 'empty' = 'all';
  sortByRating: 'none' | 'asc' | 'desc' = 'none';

  appliedFilters$ = new BehaviorSubject<string[]>([]);

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

  constructor(
    private lombardService:LombardService,
    private productService:ProductService
  ){

  }

  ngOnInit(){

    this.lombards$ = this.lombardService.getLombards().pipe(
      switchMap(lombards => {
  
        const requests = lombards.map(l =>
          this.productService.getProductsByOwner(l._id).pipe(
            map(products => ({ ...l, products })), 
            tap(products => console.log(products))
          )
        );
        return requests.length ? forkJoin(requests) : of([]);
      })
    );

    this.filteredLombards$ = combineLatest([
      this.lombards$,
      this.searchTerm$,
      this.appliedFilters$
    ]).pipe(
      map(([lombards, search, appliedFilters])=>{
        let filtered = lombards;

        if(search.trim()){
          filtered = filtered.filter(l =>
            l.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (appliedFilters.length > 0) {
          filtered = filtered.filter(lombard =>
            lombard.products?.some(product =>
              appliedFilters.some(f =>
                product.title.toLowerCase().includes(f.toLowerCase())
              )
            )
          );
        }

        return filtered;

      })
    )

    

  }

  onHelpItemClick(item: string) {
    
   const current = this.appliedFilters$.value;
    if (!current.includes(item)) {
      this.appliedFilters$.next([...current, item]); // ✅ обновляем поток
    }
  }
  removeFilter(filter: string) {
    const current = this.appliedFilters$.value;
    this.appliedFilters$.next(current.filter(f => f !== filter));
    this.searchTerm$.next(this.searchTerm$.value);
  }

   onSearchChange(value: string) {
    this.searchTerm$.next(value);
  }

}
