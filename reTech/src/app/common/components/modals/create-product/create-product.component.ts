import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import { FormBuilder, FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../../../shared/services/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule,TranslateModule, FormsModule,ReactiveFormsModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent {

  @Input() ownerId!: string;

  productForm : FormGroup;

  constructor(
    private fb:FormBuilder,
    private productService:ProductService,
    public activeModal : NgbActiveModal
  ){
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      photos: this.fb.control<string[]>([]),
      status: ['open'],
      price: [null, [Validators.required, Validators.min(1)]],
    });
  }

  get title() {
    return this.productForm.get('title')!;
  }

  get category() {
    return this.productForm.get('category')!;
  }

  get price() {
    return this.productForm.get('price');
  }

  saveProduct() {
    if (this.productForm.valid) {
      const product: Product = {
        ...this.productForm.value,
        ownerId: this.ownerId, // 👈 добавляем id пользователя перед отправкой
      };

      this.productService.createProduct(product).subscribe(() => {
        this.activeModal.close(true);
      });
    }
  }

  close() {
    this.activeModal.dismiss();
  }

}
