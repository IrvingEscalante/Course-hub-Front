import { Routes } from "@angular/router";
import { authGuardsGuard } from "../../core/guards/auth.guards-guard";


export const COURSES_ROUTES: Routes = [
    {path: 'create', loadComponent: () => import('./course-form/course-form').then(m => m.CourseForm), canActivate:[authGuardsGuard]},
    {path: 'detail/:id', loadComponent: () => import('./detail-course/detail-course').then(m => m.DetailCourse)},
    {path: 'pull-request/:id', loadComponent: () => import('./pull-request-detail/pull-request-detail').then(m => m.PullRequestDetail)}
]