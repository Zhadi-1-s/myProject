import { CommonModule } from '@angular/common';
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../shared/interfaces/user.interface';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { LombardService } from '../../../shared/services/lombard.service';
import { AuthService } from '../../../shared/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditLombardComponent } from '../../components/modals/edit-lombard/edit-lombard.component';
import { Product } from '../../../shared/interfaces/product.interface';
import { CreateProductComponent } from '../../components/modals/create-product/create-product.component';
import { ProductService } from '../../../shared/services/product.service';
import { ViewallComponent } from '../../components/modals/viewall/viewall.component';
import { EditProductComponent } from '../../components/modals/edit-product/edit-product.component';


@Component({
  selector: 'app-lombard-profile',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './lombard-profile.component.html',
  styleUrl: './lombard-profile.component.scss'
})
export class LombardProfileComponent implements OnInit{
  
  profile: PawnshopProfile | null = null;
  items:Product[] | null;
  user:User | null;
  currentTime: Date = new Date();
  productslist : Product[] | null;

  @ViewChild('itemsTable') itemsTable!: ElementRef;

  constructor(
    private lombardService:LombardService,
    private authService:AuthService,
    private modalService: NgbModal,
    private productService:ProductService
  ){}


  ngOnInit(){
    this.authService.currentUser$.subscribe(user => {
      if(!user?._id)return;
      this.user = user;

      this.lombardService.getLombardByUserId(user._id).subscribe({
        next : (pawnshop) => {
          this.profile = pawnshop;
          console.log('loading pawnshop', pawnshop)
          this.productService.getProductsByOwner(pawnshop._id).subscribe({
            next: (products) => {
              this.productslist = products;
              console.log('Загружаем продукты ломбарда',products);
            },
            error(err) {
                console.error(err.message);
            },
          })
        },
        error(err) {
          console.error(err.message);
        }
      })
    })
  }

  get isOpenNow(): boolean {
    if (!this.profile?.openTime || !this.profile?.closeTime) return false;
    
    const now = new Date();
    const [openH, openM] = this.profile.openTime.split(':').map(Number);
    const [closeH, closeM] = this.profile.closeTime.split(':').map(Number);
    
    const open = new Date();
    open.setHours(openH, openM, 0);

    const close = new Date();
    close.setHours(closeH, closeM, 0);

    return now >= open && now <= close;
  }

  editProduct(item:Product){
    const modalRef = this.modalService.open(EditProductComponent,{size:'lg'});

    modalRef.componentInstance.product = item;
    modalRef.result.then(
      (updatedProduct:Product) => {
        if(updatedProduct){
          // Обновляем продукт в списке после редактирования
          this.productslist = this.productslist?.map(prod => prod._id === updatedProduct._id ? updatedProduct : prod) || null;
        }
      },
      () => {}
    )
  }
  deleteProduct(){}

  openEditModal(){}

  openAddOfferModal(){
    const modalRef = this.modalService.open(CreateProductComponent, {size:'lg'});

    modalRef.componentInstance.ownerId = this.profile._id;
    // modalRef.result.then((result) => {
    //   if (result) this.loadProducts();
    // });
  }

  openEditLombard(){
    const modalRef = this.modalService.open(EditLombardComponent,{centered:true})

    modalRef.componentInstance.lombard = this.profile;

    modalRef.result.then(
      (updatedShop:PawnshopProfile) => {
        if(updatedShop){
          this.profile = updatedShop
        }
      },
      () => {}
    )

  }

  openViewAllModal(){
    const modalRef = this.modalService.open(ViewallComponent, {
    size: 'lg',
    centered: true
  });
    modalRef.componentInstance.title = 'All Products';
    modalRef.componentInstance.type = 'products';
    modalRef.componentInstance.items = this.productslist;
  }

  filterOpenItems(){

  }

   computeSlotUsagePercent(profile?: PawnshopProfile, products?: Product[]) {
    const active = profile?.activeSlots?.length || 0;
    const total = (profile as any)?.totalSlots ?? Math.max(active, 1);
    return Math.round((active / total) * 100);
  }

  toggleItemsList:boolean = false;

  scrollToTableItem() {
    this.itemsTable.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  hover = false;
  changeProfilePhoto() {
    // Logic to change profile photo
  }

}
