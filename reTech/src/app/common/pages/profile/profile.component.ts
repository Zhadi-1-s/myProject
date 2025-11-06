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
import { Observable,map,pipe } from 'rxjs';
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
  user: User;
  loading = true;
  error: string | null = null;

  myProducts:string[];

  currentTime: Date = new Date();

  selectedTab: 'active' | 'inactive' = 'active';

  products$:Observable<Product[]>;
  activeProducts$!: Observable<Product[]>;
  inactiveProducts$!: Observable<Product[]>;

  favoritePawnshops$:Observable<PawnshopProfile[]>;

  favorites: any[] = [];

  constructor(
              private authService: AuthService, 
              private modalService: NgbModal,
              private productService:ProductService,
              private userService:UserService
  ) {

  }

  ngOnInit(): void {
    this.loading = true;

    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.user = user;
        if(this.user){
          this.products$ = this.productService.getProductsByOwner(this.user._id);

             this.activeProducts$ = this.products$.pipe(
                map((products) => products.filter((p) => p.status === 'active'))
                
            );
            this.inactiveProducts$ = this.products$.pipe(
              map((products) => products.filter((p) => p.status !== 'active'))
            )
            this.loadFavorites();
        }
        
        this.loading = false;
      }
    });

    if (!this.user) {
      this.authService.getUserProfile().subscribe({
        next: (profile) => (this.user = profile),
        error: () => {
          this.error = 'Не удалось загрузить профиль';
          this.loading = false;
        },
      });
    }
    
  }

  loadFavorites(){
    if(this.user){
      this.userService.getFavorites(this.user._id).subscribe({
        next: (res) => (
          this.favorites = res,
          console.log(res)
        ),
        
        error: (err) => console.error(err),
      });
    }
  }

  deleteProduct(itemId:string){

  }

  editProduct(item:Product){
    const modalRef = this.modalService.open(EditProductComponent);

    modalRef.componentInstance.product = item;
  }

  openEditModal(){
    const modalRef = this.modalService.open(EditModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.user = this.user;

    modalRef.result.then(
      (updatedUser: User) => {
        if (updatedUser) {
          // тут можно сделать запрос на API для обновления профиля
          this.user = updatedUser;
          // this.authService.updateUser(updatedUser); 
        }
      },
      () => {} 
    );

  }

  openCreateItemModal(){
    const modalRef = this.modalService.open(CreateProductComponent);

    modalRef.componentInstance.ownerId = this.user._id;
  }

  openProductDetails(item:Product){
    const modalRef = this.modalService.open(ProductDetailComponent);

    modalRef.componentInstance.product = item;
    modalRef.componentInstance.user = this.user;
    modalRef.componentInstance.pawnshop = null;
  }

  openPawnshopDetail(id:string){

  }

}
