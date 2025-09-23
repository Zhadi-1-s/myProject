import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule,FormBuilder,Validators  } from '@angular/forms';

import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterDto } from '../../../shared/interfaces/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  submitted = false;
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    const dto: RegisterDto = {
      ...this.registerForm.value,
      role: 'user' // роль по умолчанию
    };

    this.authService.register(dto).subscribe({
      next: (response) => {
        console.log('Registration success:', response);
        this.router.navigate(['/login']); // перенаправление после регистрации
      },
      error: (err) => {
        console.error('Registration error:', err);
      }
    });
  }

  loginWithGoogle(): void {
    console.log('Google signup not yet implemented');
  }

  signIn(): void {
    this.router.navigate(['/login']);
  }

  forgotPassword(): void {
    console.log('Forgot password not implemented yet');
  }
}
