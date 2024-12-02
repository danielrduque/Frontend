import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ReservaComponent } from './reserva/reserva.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReportsComponent } from './reports/reports.component'; // Import ReportsComponent

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'reserva', component: ReservaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reports', component: ReportsComponent }, // Add route for ReportsComponent
];
