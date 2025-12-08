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
import { switchMap,Observable,tap,filter,of,forkJoin,map, take, catchError } from 'rxjs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppNotification } from '../../../shared/interfaces/notification.interface';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';
import { CreateTermComponent } from '../../components/modals/create-term/create-term.component';
import { TermModalComponent } from '../../components/modals/term-modal/term-modal.component';
import { PawnshopTerms } from '../../../shared/interfaces/pawnshopTerm.interface';
import { EvaluationService } from '../../../shared/services/evaluation.service';
import { error } from 'console';
import { EvaluationDetailComponent } from '../../components/modals/evaluation-detail/evaluation-detail.component';
import { OfferService } from '../../../shared/services/offer.service';


@Component({
  selector: 'app-lombard-profile',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './lombard-profile.component.html',
  styleUrl: './lombard-profile.component.scss'
})
export class LombardProfileComponent implements OnInit{
  
  profile: PawnshopProfile | null = null;
  items:Product[] | null;
  user:User | null;
  currentTime: Date = new Date();
  productslist : Product[] | null;
  notificationsList:any;
  prodcuctsFromNotifications:Product[];
  productofSlot:Product | null;

  activeSlots:Slot[] | null;

  slotWithProduct: { slot: Slot; product: Product }[] = [];

  @ViewChild('itemsTable') itemsTable!: ElementRef;

  profile$!: Observable<PawnshopProfile>;
 
  private slotsSubject = new BehaviorSubject<{ slot: Slot; product: Product }[]>([]);
  slotsWithProducts$ = this.slotsSubject.asObservable();
  products$!: Observable<Product[]>;
  notifications$!: Observable<AppNotification[]>;
  fromUserNotifications$:Observable<AppNotification>

  viewMode:boolean = true;
  isEditing:boolean = false;

  selectedTab: 'active' | 'inactive' = 'active';
  activeSection: 'offers' | 'system' | 'chats' | 'others' = 'offers';
  sections = [
    { id: 'offers', label: 'Offers' },
    { id: 'system', label: 'System' },
    { id: 'chats', label: 'Chats', disabled: true },
    { id: 'others', label: 'Others' },
  ];

  constructor(
    private lombardService:LombardService,
    private authService:AuthService,
    private modalService: NgbModal,
    private productService:ProductService,
    private slotService:SlotService,
    private notificationService:NotificationService,
    private evaluationService:EvaluationService,
    private offerService:OfferService
    
  ){}

  ngOnInit() {

    this.profile$ = this.authService.currentUser$.pipe(
      filter((user): user is User => !!user?._id),
      switchMap(user => this.lombardService.getLombardByUserId(user._id)),
      tap(profile => {console.log('Loaded profile:', profile), this.profile = profile})
    );

    this.products$ = this.profile$.pipe(
      switchMap(profile => this.productService.getProductsByOwner(profile._id)),
      // tap(products => console.log('Loaded products:', products))
    );

    this.notifications$ = this.profile$.pipe(
      switchMap(profile => this.notificationService.getUserNotifications(profile._id)),
      tap(notifications => {this.notificationsList = notifications,console.log(notifications,'loaded notifications for lombard')}),
      switchMap(notifications => {
        const refIds = notifications.map(r => r.refId).filter(id => !!id)

        if(!refIds.length) return of([]);

        return forkJoin(
          refIds.map(id => 
            this.productService.getProductById(id).pipe(
              map(product => ({
                type:'product' as const,
                data:product,
                id
              })),
              catchError(() => 
                this.evaluationService.getEvaluationById(id).pipe(
                  map(evaluation => ({
                    type:'evalutaion' as const,
                    data:evaluation,
                    id
                  })),
                  catchError(() => of({type:'unknown',data:null,id}))
                )
              )
            )
          )
        )

      }),
      tap(items => {
        this.prodcuctsFromNotifications = Object.fromEntries(items.map(item => [item.id,item]));
        console.log(this.prodcuctsFromNotifications, 'items from notifications');
      })

    );
    this.loadOffers();
    this.loadSlots();
  }

  loadSlots() {
    this.authService.currentUser$.pipe(
      filter((user): user is User => !!user?._id),
      switchMap(user => this.lombardService.getLombardByUserId(user._id)),
      switchMap(pawnshop => this.slotService.getSlotsByPawnshopId(pawnshop._id)),
      map(slots => slots.filter(slot => slot.status === 'active')),
      switchMap(activeSlots => {
        if (activeSlots.length === 0) return of([]);
        const requests = activeSlots.map(slot =>
          this.productService.getProductById(slot.product).pipe(map(product => ({ slot, product })))
        );
        return forkJoin(requests);
      })
    ).subscribe(data => this.slotsSubject.next(data));
  }

 loadOffers() {
    this.authService.currentUser$.pipe(
      filter((user): user is User => !!user?._id),
      switchMap(user => this.lombardService.getLombardByUserId(user._id)),
      switchMap(pawnshop => this.offerService.getOffersByPawnshop(pawnshop._id))
    ).subscribe(offers => {
      // Добавляем в notificationsList как "тип оффер"
      const normalized = offers.map(o => ({
        _id: o._id,
        type: 'sent-offer' as const,
        title: `Offer for product`,
        message: `Price: ${o.price} ₸` + (o.message ? ` — ${o.message}` : ''),
        refId: o.productId,      // используем productId для связи с продуктом
        isRead: true,             // свои офферы считаем уже прочитанными
        createdAt: o.createdAt || new Date(),
        data: o                    // полный объект оффера для деталей
      }));

      this.notificationsList = [
        ...this.notificationsList,
        ...normalized
      ];
    });
  }


  editableDescription = '';

  toggleEdit() {
    this.isEditing = true;
    this.editableDescription = this.profile?.description || '';
  }

  saveDescription() {
    if(!this.profile?._id) return;

    const updatedLombard: Partial<PawnshopProfile> = {
      userId: this.profile?.userId || '',
      name: this.profile?.name || '',
      address: this.profile?.address || '',
      phone: this.profile?.phone || '',
      slotLimit: this.profile?.slotLimit || 0,
      description: this.editableDescription,
    };

     this.lombardService.updateLombard(this.profile._id, updatedLombard)
    .subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile; 
        this.isEditing = false; 
        console.log('Description updated:', updatedProfile);
      },
      error: (err) => {
        console.error('Error updating lombard:', err);
      }
    });
  }

  cancelEdit(){
    this.isEditing = false;
  }

  markAsRead(notification:AppNotification){
    if (!notification._id || notification.isRead) return;

    this.notificationService.markAsRead(notification._id).subscribe({
      next: updatedNotification => {
        notification.isRead = true;
      },
      error: err => console.error(err)
    });

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
  
 get offerNotifications() {
    return (this.notificationsList || []).filter(n =>
      ['new-offer','offer-accepted','offer-rejected','sent-offer'].includes(n.type)
    );
  }
  get systemNotifications() {
    return (this.notificationsList || []).filter(n => n.type === 'system');
  }

  get chatNotifications() {
    return (this.notificationsList || []).filter(n => n.type === 'chat-opened');
  }

  get otherNotifications() {
    return (this.notificationsList || []).filter(n =>
      ['product-sold','price-changed','chat-opened'].includes(n.type)
    );
  }

  get unreadOfferNotifications() {
    return (this.notificationsList || []).filter(
      n => ['new-offer','offer-accepted','offer-rejected'].includes(n.type) && !n.isRead
    );
  }

  getStars(rating: number = 0): string {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty);
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

  openTerms() {
    const terms = this.profile?.terms;
    console.log('Current terms:', terms);

    const hasTerms = terms && Object.values(terms).some(value => {
      // если строка — проверяем пустую
      if (typeof value === 'string') return value.trim() !== '';
      // если число — проверяем больше нуля
      if (typeof value === 'number') return value > 0;
      return false;
    });

    if (hasTerms) {
      this.openTermsModal();   // показываем существующие terms
    } else {
      this.openCreateTermModal();   // создаём новые terms
    }
  }

  openCreateTermModal(){
    const modalRef = this.modalService.open(CreateTermComponent, { size: 'lg', centered: true });

    modalRef.componentInstance.pawnshopId = this.profile?._id;
  }

  openAddOfferModal(){
    const modalRef = this.modalService.open(CreateProductComponent, {size:'lg'});

    modalRef.componentInstance.ownerId = this.profile._id;
    // modalRef.result.then((result) => {
    //   if (result) this.loadProducts();
    // });
  }

  extendSlot(item:Slot){}
  
  deleteSlot(slotId: string) {
    this.slotService.deleteSlot(slotId).subscribe({
      next: () => {
        const updated = this.slotsSubject.value.filter(item => item.slot._id !== slotId);
        this.slotsSubject.next(updated);
      },
      error: err => console.error(err)
    });
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

  openEvaluationDetail(evaluationId: string) {

    const notification = this.notificationsList.find(
      n => n.refId === evaluationId
    );

    if (notification) {
      this.markAsRead(notification);
    }

    console.log(evaluationId, 'this is the evalId from click')
    const modalRef = this.modalService.open(EvaluationDetailComponent, {
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.evaluationId = evaluationId;
  }


  openTermsModal(){
    const modalRef = this.modalService.open(TermModalComponent, { size: 'lg', centered: true });

    modalRef.componentInstance.terms = this.profile.terms;
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
