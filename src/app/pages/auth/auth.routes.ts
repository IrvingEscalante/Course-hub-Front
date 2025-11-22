import { Routes } from "@angular/router";
import { Register } from "./register/register";
import { Login } from "./login/login";
import { Dashboard } from "../dashboard/dashboard";
import { UserResolver } from "../../core/services/user-resolver.service";
import { VerifyEmail } from "./verify-email/verify-email";
import { RecoverPassword } from "./recover-password/recover-password";
import { ChangePassword } from "./change-password/change-password";

export const AUTH_ROUTES: Routes = [
    {path: '', component:Dashboard, resolve:{user : UserResolver}},
    {path: 'register', component:Register},
    {path: 'login', component:Login},
    {path: 'verify-email', component:VerifyEmail},
    {path: 'recover-password', component: RecoverPassword},
    {path: 'change-password-recover', component: ChangePassword}
]