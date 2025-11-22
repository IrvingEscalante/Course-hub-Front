import { Routes } from '@angular/router';
import { ProfileUser } from './pages/profile-user/profile-user';
import { EditProfile } from './pages/edit-profile/edit-profile';


export const routes: Routes = [
    {
        path: '', loadChildren: ()=> import('./pages/auth/auth.routes').then(m=> m.AUTH_ROUTES)
    },
    {
        path:'course', loadChildren: () => import('./pages/courses/courses.routes').then(m=>m.COURSES_ROUTES)
    },
     {
        path: 'edit-profile', component:EditProfile
    },
    {
        path:':username', component:ProfileUser
    }
];
