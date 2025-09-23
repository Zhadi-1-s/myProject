import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ResetPasswordComponent } from '../../components/modals/reset-password/reset-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
    
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful, token:', response.access_token);
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Login failed:', error);

          if (error.error && error.error.message) {
            this.serverError = error.error.message;
          } else {
            this.serverError = 'Invalid credentials or account does not exist';
          }

        }
      })
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
