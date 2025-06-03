import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RequestResetComponent } from './request-reset/request-reset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './auth.guard';
import { AuthLoginGuard } from './auth-login.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthLoginGuard]},
  { path: 'register', component: RegisterComponent },
  { path: 'request-reset', component: RequestResetComponent },
  { path: 'reset', component: ResetPasswordComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  // {
  //   path: 'access-groups',
  //   component: AccessGroupComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'user-groups',
  //   component: GroupListComponent,
  //   canActivate: [AuthGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
