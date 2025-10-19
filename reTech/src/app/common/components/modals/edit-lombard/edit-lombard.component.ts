import { Component,Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../shared/interfaces/user.interface';
import { PawnshopProfile } from '../../../../shared/interfaces/shop-profile.interface';
import { LombardService } from '../../../../shared/services/lombard.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-lombard',
  standalone: true,
  imports: [CommonModule,FormsModule,TranslateModule],
  templateUrl: './edit-lombard.component.html',
  styleUrl: './edit-lombard.component.scss'
})
export class EditLombardComponent implements OnInit {

  @Input() lombard: PawnshopProfile;

  editedShop:PawnshopProfile;

  constructor(private modalService:NgbActiveModal, private lombardService:LombardService){

  }

  ngOnInit(){
    this.editedShop = {...this.lombard};
  }

  saveChanges():void{
    this.lombardService.updateLombard(this.editedShop._id,this.editedShop).subscribe(updatedData => {
      this.editedShop = updatedData;
      this.modalService.close(this.editedShop);
    })
  }

   cancel(): void {
    this.modalService.dismiss();
  }

}
