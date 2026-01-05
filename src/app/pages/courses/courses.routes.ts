import { Routes } from "@angular/router";
import { authGuardsGuard } from "../../core/guards/auth.guards-guard";
import { CourseForm } from "./course-form/course-form";
import { DetailCourse } from "./detail-course/detail-course";
import { PullRequestDetail } from "./pull-request-detail/pull-request-detail";


export const COURSES_ROUTES: Routes = [
    {path: 'create', component:CourseForm, canActivate:[authGuardsGuard]},
    {path: 'detail/:id', component:DetailCourse},
    {path: 'pull-request/:id', component:PullRequestDetail}
]