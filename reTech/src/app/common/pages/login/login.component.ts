import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ResetPasswordComponent } from '../../components/modals/reset-password/reset-password.component';

import { TranslateModule } from '@ngx-translate/core';

import { JwtPayload } from '../../../shared/interfaces/jwt-payload.interface';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  serverError: string | null = null
  submitted = false;
  loginForm: FormGroup;

  constructor(
    private modalService:NgbModal,
      private router: Router,
      private fb: FormBuilder,
      private authService: AuthService)
      {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
  }

  // switchLang(lang: string) {
  //   this.translate.use(lang);
  //   localStorage.setItem('lang', lang);
  // }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          const token = response.access_token
          // Сохраняем токен
          localStorage.setItem('access_token', response.access_token);

          const decoded: JwtPayload = jwtDecode(token);
          console.log('Decoded token:', decoded);

          const userRole = decoded.role;
         
          if (userRole === 'pawnshop') {
            this.router.navigate(['/lombard-profile']); 
          // } else if (userRole === 'admin') {
          //   this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/profile']); 
          }
        },
        error: (error) => {
          console.error('Login failed:', error);

          if (error.error && error.error.message) {
            this.serverError = error.error.message;
          } else {
            this.serverError = 'Invalid credentials or account does not exist';
          }
        }
      });
    }
  }


  register(): void {
    this.router.navigate(['/register']);
  }

  forgotPassword(): void {
    this.modalService.open(ResetPasswordComponent, { size: 'md' });

  }

  loginWithGoogle(): void {}

}
