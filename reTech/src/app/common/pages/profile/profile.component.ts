import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditModalComponent } from '../../components/modals/edit-modal/edit-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'] 
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;

  myProducts:string[];

  currentTime: Date = new Date();



  constructor(private authService: AuthService,private router:Router,private modalService: NgbModal) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.loading = false;
        console.log(this.user);
      },
      error: (err) => {
        // this.router.navigate(['/login'])
        this.error = 'Не удалось загрузить профиль';
        this.loading = false;
      }
    });

    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);// раз в 60 секунд 
  }

  openEditModal(){
    const modalRef = this.modalService.open(EditModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.user = this.user;

    modalRef.result.then(
      (updatedUser: User) => {
        if (updatedUser) {
          // тут можно сделать запрос на API для обновления профиля
          this.user = updatedUser;
          // this.authService.updateUser(updatedUser); 
        }
      },
      () => {} // закрытие без сохранения
    );

  }

}
