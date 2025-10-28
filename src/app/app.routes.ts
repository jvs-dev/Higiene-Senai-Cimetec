import { Routes } from '@angular/router';
import { LoyoutComponent } from './core/loyout/loyout.component';
import { LoginComponent } from './feactures/auth/login/login.component';
import { PublicFormComponent } from './feactures/public-form/public-form.component';
import { DashboardComponent } from './feactures/dashboard/dashboard.component';
import { AuthGuard } from './core/services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoyoutComponent,
    children: [
      {
        path: '',
        component: PublicFormComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];