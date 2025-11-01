import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { LombardService } from '../../../shared/services/lombard.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pawnshop-list',
  standalone: true,
  imports: [CommonModule,TranslateModule, ReactiveFormsModule,FormsModule],
  templateUrl: './pawnshop-list.component.html',
  styleUrl: './pawnshop-list.component.scss'
})
export class PawnshopListComponent implements OnInit{

  lombards$:Observable<PawnshopProfile[]>;

  searchTerm: string = '';

  activeFilter: 'all' | 'active' | 'empty' = 'all';
  sortByRating: 'none' | 'asc' | 'desc' = 'none';

  appliedFilters: string[] = [];

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
    private lombardService:LombardService
  ){

  }

  ngOnInit(){

    this.lombards$ = this.lombardService.getLombards();

  }

  onHelpItemClick(item: string) {
    // добавляем фильтр, если его нет
    if (!this.appliedFilters.includes(item)) {
      this.appliedFilters.push(item);
    }
  }
  removeFilter(filter: string) {
    this.appliedFilters = this.appliedFilters.filter(f => f !== filter);
  }

  filterLombards(lombards: PawnshopProfile[]): PawnshopProfile[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return lombards;
    return lombards.filter(l =>
      l.name.toLowerCase().includes(term)
    );
  }

}
