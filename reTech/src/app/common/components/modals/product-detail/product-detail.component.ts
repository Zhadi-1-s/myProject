import { Component, Input ,OnInit} from '@angular/core';
import { Product } from '../../../../shared/interfaces/product.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ImageViewComponent } from '../../image-view/image-view.component';
import { PawnshopProfile } from '../../../../shared/interfaces/shop-profile.interface';
import { User } from '../../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [TranslateModule,CommonModule,ImageViewComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

  @Input() product: Product;
  @Input() pawnshop: PawnshopProfile | null;
  @Input() user: User | null;
  
  canEdit = false;

  constructor(
    public activeModal: NgbActiveModal,
  ) {
  }
  
 ngOnInit() {
    // console.log('INIT DETAIL:', {
    //   product: this.product,
    //   pawnshop: this.pawnshop,
    //   user: this.user
    // });

    if (!this.product || !this.user) return;

    if (this.product.ownerId === this.user._id) {

      this.canEdit = true;
      return;
    }

    if (
      this.pawnshop &&
      this.product.ownerId === this.pawnshop._id &&
       this.pawnshop.userId === this.user._id
    ) {

      this.canEdit = true;
      return;
    }

  }


  onPhotoRemoved(index: number) {
    this.product.photos.splice(index, 1);
  }

  onPhotoAdded() {
    console.log('Open upload dialog...');
  }

}
