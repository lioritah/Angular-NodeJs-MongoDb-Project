import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './layout/auth/auth/auth.component';
import { LoginComponent } from './layout/auth/login/login.component';
import { RegisterComponent } from './layout/auth/register/register.component';
import { AlreadyAuthenticatedGuard } from './guards/already-authenticated.guard';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './layout/home/home.component';
import { AddProductComponent } from './layout/admin-page/add-product/add-product.component';
import { EditProductComponent } from './layout/admin-page/edit-product/edit-product.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { OrderCompleteComponent } from './order-complete/order-complete.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [AlreadyAuthenticatedGuard],
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [AlreadyAuthenticatedGuard],
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
    canActivate: [AlreadyAuthenticatedGuard],
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'admin/new', component: AddProductComponent },
  { path: 'admin/:id/edit', component: EditProductComponent },
  { path: 'order-complete', component: OrderCompleteComponent },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
