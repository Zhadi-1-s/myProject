import { CommonModule } from '@angular/common';
import { Component, OnInit,ViewChild,ElementRef, ChangeDetectorRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../shared/interfaces/user.interface';
import { PawnshopProfile } from '../../../shared/interfaces/shop-profile.interface';
import { LombardService } from '../../../shared/services/lombard.service';
import { AuthService } from '../../../shared/services/auth.service';
import { NgbModal, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { EditLombardComponent } from '../../components/modals/edit-lombard/edit-lombard.component';
import { Product } from '../../../shared/interfaces/product.interface';
import { CreateProductComponent } from '../../components/modals/create-product/create-product.component';
import { ProductService } from '../../../shared/services/product.service';
import { ViewallComponent } from '../../components/modals/viewall/viewall.component';
import { EditProductComponent } from '../../components/modals/edit-product/edit-product.component';
import { ProductDetailComponent } from '../../components/modals/product-detail/product-detail.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateSlotComponent } from '../../components/modals/create-slot/create-slot.component';
import { Slot } from '../../../shared/interfaces/slot.interface';
import { SlotService } from '../../../shared/services/slot.service';
import { switchMap,Observable,tap,filter,of,forkJoin,map, take } from 'rxjs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lombard-profile',
  standalone: true,
  imports: [CommonModule,TranslateModule,NgbModalModule,
    NgbTooltipModule,NgbDropdownModule],
  templateUrl: './lombard-profile.component.html',
  styleUrl: './lombard-profile.component.scss'
})
export class LombardProfileComponent implements OnInit{
  
  profile: PawnshopProfile | null = null;
  items:Product[] | null;
  user:User | null;
  currentTime: Date = new Date();
  productslist : Product[] | null;

  productofSlot:Product | null;

  activeSlots:Slot[] | null;

  slotWithProduct: { slot: Slot; product: Product }[] = [];

  @ViewChild('itemsTable') itemsTable!: ElementRef;

  profile$!: Observable<PawnshopProfile>;
  slotsWithProducts$!: Observable<{ slot: Slot; product: Product }[]>;
  products$!: Observable<Product[]>;

  constructor(
    private lombardService:LombardService,
    private authService:AuthService,
    private modalService: NgbModal,
    private productService:ProductService,
    private slotService:SlotService,
    private cdr:ChangeDetectorRef
  ){}

  ngOnInit() {

    this.profile$ = this.authService.currentUser$.pipe(
      filter((user): user is User => !!user?._id),
      switchMap(user => this.lombardService.getLombardByUserId(user._id)),
      tap(profile => console.log('Loaded profile:', profile))
    );

    this.products$ = this.profile$.pipe(
      switchMap(profile => this.productService.getProductsByOwner(profile._id)),
      tap(products => console.log('Loaded products:', products))
    );

    this.slotsWithProducts$ = this.authService.currentUser$.pipe(
      filter((user): user is User => !!user?._id),
      switchMap(user => this.lombardService.getLombardByUserId(user._id)),
      switchMap(pawnshop => {
        this.profile = pawnshop;
        return this.slotService.getSlotsByPawnshopId(pawnshop._id);
      }),
      tap(slots => console.log('Loaded slots:', slots)),
      map(slots => slots.filter(slot => slot.status === 'active')),
      switchMap(activeSlots => {
        if (activeSlots.length === 0) return of([]);

        const productRequests = activeSlots.map(slot =>
          this.productService.getProductById(slot.product).pipe(
            map(product => ({ slot, product }))
          )
        );

        return forkJoin(productRequests);
      }),
      tap(data => console.log('Loaded slots with products:', data))
    );
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

  extendSlot(item:Slot){}
  
  deleteSlot(item:string){}

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

  openProductDetail(item: Product) {

    const modalRef = this.modalService.open(ProductDetailComponent, { size: 'lg',centered:true });

    modalRef.componentInstance.product = item;
    modalRef.componentInstance.user = this.user;
    modalRef.componentInstance.pawnshop = this.profile;
  }

  openCreateSlotModal(){
    
    this.profile$.pipe(take(1)).subscribe(profile => {
      const modalRef = this.modalService.open(CreateSlotComponent, {size:'lg'});

      modalRef.componentInstance.pawnshop = profile;
      modalRef.componentInstance.user = this.user;
      
      // modalRef.componentInstance.changeDetectorRef.detectChanges?.();
    })


  }

  openSlotDetails(item: Slot) {}
  editSlot(item: Slot) {}
  
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
