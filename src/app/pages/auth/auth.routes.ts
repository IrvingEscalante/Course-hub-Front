import { Routes } from "@angular/router";
import { UserResolver } from "../../core/services/user-resolver.service";
import { landingRedirectGuard } from "../../core/guards/landing-redirect.guard";

export const AUTH_ROUTES: Routes = [
    {path: '', loadComponent: () => import('../landing/landing').then(m => m.Landing), canActivate: [landingRedirectGuard]},
    {path: 'courses', loadComponent: () => import('../dashboard/dashboard').then(m => m.Dashboard), resolve:{user : UserResolver}},
    {path: 'register', loadComponent: () => import('./register/register').then(m => m.Register)},
    {path: 'login', loadComponent: () => import('./login/login').then(m => m.Login)},
    {path: 'verify-email', loadComponent: () => import('./verify-email/verify-email').then(m => m.VerifyEmail)},
    {path: 'recover-password', loadComponent: () => import('./recover-password/recover-password').then(m => m.RecoverPassword)},
    {path: 'change-password-recover', loadComponent: () => import('./change-password/change-password').then(m => m.ChangePassword)}
]