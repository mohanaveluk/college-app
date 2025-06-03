import { Routes } from "@angular/router";
import { AuthLoginGuard } from "./auth-login.guard";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { RequestResetComponent } from "./request-reset/request-reset.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { AuthGuard } from "./auth.guard";

export const authRoutes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [AuthLoginGuard]},
    { path: 'register', component: RegisterComponent },
    { path: 'request-reset', component: RequestResetComponent },
    { path: 'reset', component: ResetPasswordComponent },
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
    
  ];