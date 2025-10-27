import { Component,Input } from '@angular/core';
import { Product } from '../../../../shared/interfaces/product.interface';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../shared/services/product.service';
@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [TranslateModule,ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {
  @Input() product!: Product;

  form!: FormGroup;
  photos: string[] = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.photos = [...(this.product.photos || [])];
    this.form = this.fb.group({
      title: [this.product.title, [Validators.required, Validators.minLength(2)]],
      description: [this.product.description || ''],
      category: [this.product.category, Validators.required],
      price: [this.product.price, [Validators.required, Validators.min(0)]],
      status: [this.product.status, Validators.required],
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.photos.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
  }

  save() {
    if (this.form.invalid) return;
    const updated: Product = {
      ...this.product,
      ...this.form.value,
      updatedAt: new Date(),
    };
    this.productService.updateProduct(this.product._id!, updated).subscribe({
    next: (res) => {
      this.activeModal.close(res); // возвращаем обновлённый товар
    },
    error: (err) => {
      console.error('Ошибка при обновлении продукта:', err);
    },
  });
 
  }
}
