import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { EditModalComponent } from '../../components/modals/edit-modal/edit-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../shared/services/product.service';
import { Observable,map,pipe ,filter, switchMap, tap,firstValueFrom} from 'rxjs';
import { Product } from '../../../shared/interfaces/product.interface';
import { CreateProductComponent } from '../../components/modals/create-product/create-product.component';
import { ProductDetailComponent } from '../../components/modals/product-detail/product-detail.component';
import { EditProductComponent } from '../../components/modals/edit-product/edit-product.component';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, NgbTooltip],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'] 
})
export class ProfileComponent implements OnInit {
  user$:Observable<User>;
  loading = true;
  error: string | null = null;

  myProducts:string[];

  currentTime: Date = new Date();

  selectedTab: 'active' | 'inactive' = 'active';

  products$:Observable<Product[]>;
  activeProducts$!: Observable<Product[]>;
  inactiveProducts$!: Observable<Product[]>;
  favoritePawnshops$:Observable<PawnshopProfile[]>;
  favoriteProducts$:Observable<Product[]>;

  constructor(
              private authService: AuthService, 
              private modalService: NgbModal,
              private productService:ProductService,
              private userService:UserService
  ) {

  }

  ngOnInit(): void {
    this.user$ = this.authService.currentUser$
    
    this.loading = true;

    this.activeProducts$ = this.authService.currentUser$.pipe(
      filter((user): user is User => !!user?._id),
      switchMap(user => this.productService.getProductsByOwner(user._id)),
      map((products) => products.filter((p => p.status === 'active')))
    )
    this.inactiveProducts$ = this.authService.currentUser$.pipe(
      filter((user):user is User => !!user?._id),
      switchMap(user => this.productService.getProductsByOwner(user._id)),
      map((products) => products.filter((p => p.status !== 'active')))
    )

    this.favoritePawnshops$ = this.authService.currentUser$.pipe(
      filter((user): user is User => !!user?._id),
      switchMap(user => this.userService.getFavorites(user._id)),
      tap(pawnshop => console.log(pawnshop,'loaded farvoire pawnshops'))
    )
    this.favoriteProducts$ = this.authService.currentUser$.pipe(
      filter((user):user is User => !!user?._id),
      switchMap(user => this.userService.getFavoriteItems(user._id)),
      tap(products => console.log(products, 'loaded favorite products'))
    )
    
  }
  deleteProduct(itemId:string){

  }

  editProduct(item:Product){
    const modalRef = this.modalService.open(EditProductComponent);

    modalRef.componentInstance.product = item;
  }

  async openEditModal() {
    const user = await firstValueFrom(this.authService.currentUser$);

    if (!user) return;

    const modalRef = this.modalService.open(EditModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.user = user;

  }

  async openCreateItemModal(){
    const user = await firstValueFrom(this.authService.currentUser$);
    const modalRef = this.modalService.open(CreateProductComponent);

    modalRef.componentInstance.ownerId = user._id;
  }

  async openProductDetails(item:Product){
    const user = await firstValueFrom(this.authService.currentUser$);
    const modalRef = this.modalService.open(ProductDetailComponent);

    modalRef.componentInstance.product = item;
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.pawnshop = null;
  }

  openPawnshopDetail(id:string){

  }

}
