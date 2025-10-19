import { Component,Input } from '@angular/core';
import { LombardService } from '../../../../shared/services/lombard.service';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PawnshopProfile } from '../../../../shared/interfaces/shop-profile.interface';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-create-lombard',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,TranslateModule],
  templateUrl: './create-lombard.component.html',
  styleUrl: './create-lombard.component.scss'
})
export class CreateLombardComponent {

   @Input() userId!: string; // приходит из login компонента
  lombardForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
      private lombardService:LombardService,
      private fb: FormBuilder,
      private activeModal: NgbActiveModal,
  ){
      this.lombardForm = this.fb.group({
        name: ['', Validators.required],
        address: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
        openTime: ['', Validators.required],
        closeTime: ['', Validators.required],
        description: ['']
      });
  }

  submit() {
    if (this.lombardForm.invalid) return;

    this.loading = true;
    const payload: PawnshopProfile = {
      userId: this.userId,
      ...this.lombardForm.value
    };

    this.lombardService.createLombard(payload).subscribe({
      next: () => {
        this.loading = false;
        this.activeModal.close('created');
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMessage = 'Ошибка при создании ломбарда';
      }
    });
  }

  cancel(){
    this.activeModal.dismiss();
  }

}
