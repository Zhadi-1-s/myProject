import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../shared/interfaces/user.interface';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../../shared/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule,FormsModule,TranslateModule],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.scss'
})
export class EditModalComponent {

  @Input() user: User; // получаем данные из родительского компонента
  editedUser: User;

  constructor(public activeModal: NgbActiveModal, private authService: AuthService) {}

  ngOnInit(): void {
    // копируем данные, чтобы не редактировать оригинальный объект
    this.editedUser = { ...this.user };
  }

  saveChanges(): void {
    // можно добавить валидацию перед закрытием
    this.authService.updateUser(this.editedUser).subscribe(updatedUser => {
        this.editedUser = updatedUser;
        this.activeModal.close(this.editedUser);
    });
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

}
