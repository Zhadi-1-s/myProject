import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login', loadComponent: () => import('./common/pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'profile',loadComponent: () => import('./common/pages/profile/profile.component').then((m) => m.ProfileComponent),canActivate: [AuthGuard],
    },
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        path:'register', loadComponent: () => import('./common/pages/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path:'reset-password',loadComponent : () => import('./common/pages/create-password/create-password.component').then(m => m.CreatePasswordComponent)
    }
];
