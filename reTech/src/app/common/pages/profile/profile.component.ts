import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditModalComponent } from '../../components/modals/edit-modal/edit-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../shared/services/product.service';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/interfaces/product.interface';
import { CreateProductComponent } from '../../components/modals/create-product/create-product.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,TranslateModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'] 
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;

  myProducts:string[];

  currentTime: Date = new Date();

  products$:Observable<Product[]>;

  constructor(
              private authService: AuthService, 
              private modalService: NgbModal,
              private productService:ProductService
  ) {}

  ngOnInit(): void {
    this.loading = true;

  
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.user = user;
        this.products$ = this.productService.getProductsByOwner(this.user._id);
        
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
      () => {} // закрытие без сохранения
    );

  }

  openCreateItemModal(){
    const modalRef = this.modalService.open(CreateProductComponent);

    modalRef.componentInstance.ownerId = this.user._id;
  }

  openProductDetails(product:Product){

  }

}
