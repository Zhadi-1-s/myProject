import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable,of,combineLatest,map } from 'rxjs';
import { Product } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../../shared/services/product.service';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {


  products$:Observable<Product[]>;
  filteredProducts$:Observable<Product[]> = of([])
  searchTerm$ = new BehaviorSubject<string>('');

  appliedFilters$ = new BehaviorSubject<string[]>([])

  constructor(
    private productService :ProductService
  ){

  }

  ngOnInit(){
      this.products$ = this.productService.getProcutsList();

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

  onSearchChange(event){
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm$.next(value);
  }

}
