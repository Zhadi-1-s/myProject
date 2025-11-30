import { Component, Input,Output,EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OfferService } from '../../../../shared/services/offer.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-evalutaion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evalutaion.component.html',
  styleUrl: './evalutaion.component.scss'
})
export class EvalutaionComponent {

  @Input() pawnshopId:string;
  @Output() closed = new EventEmitter();

  constructor(private fb: FormBuilder, private service: OfferService) {}

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    condition: ['good', Validators.required],
    photos: [[]],
    expectedPrice: [null],
    userTelephoneNumber: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.value,
      pawnshopId: this.pawnshopId,
      userId: 'CURRENT_USER_ID' // подставишь сам из auth
    };

    // this.service.create(payload).subscribe(() => {
    //   this.closed.emit();
    // });
  }


}
