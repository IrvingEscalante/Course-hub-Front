import { Routes } from "@angular/router";
import { authGuardsGuard } from "../../core/guards/auth.guards-guard";
import { CourseForm } from "./course-form/course-form";
import { DetailCourse } from "./detail-course/detail-course";


export const COURSES_ROUTES: Routes = [
    {path: 'create', component:CourseForm},
    {path: 'edit/:id', component:CourseForm},
    {path: 'copy/:id', component:CourseForm},
    {path: 'detail/:id', component:DetailCourse}
]