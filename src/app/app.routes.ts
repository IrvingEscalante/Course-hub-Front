import { Routes } from '@angular/router';
import { ProfileUser } from './pages/profile-user/profile-user';


export const routes: Routes = [
    {
        path: '', loadChildren: ()=> import('./pages/auth/auth.routes').then(m=> m.AUTH_ROUTES)
    },
    {
        path:'course', loadChildren: () => import('./pages/courses/courses.routes').then(m=>m.COURSES_ROUTES)
    },
    {
        path:':username', component:ProfileUser
    }
];
