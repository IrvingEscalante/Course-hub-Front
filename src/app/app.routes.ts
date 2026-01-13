import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '', loadChildren: ()=> import('./pages/auth/auth.routes').then(m=> m.AUTH_ROUTES)
    },
    {
        path:'course', loadChildren: () => import('./pages/courses/courses.routes').then(m=>m.COURSES_ROUTES)
    },
     {
        path: 'edit-profile', loadComponent: () => import('./pages/edit-profile/edit-profile').then(m => m.EditProfile)
    },
    {
        path:':username', loadComponent: () => import('./pages/profile-user/profile-user').then(m => m.ProfileUser)
    }
    ,
    {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundPage)
    }
];
