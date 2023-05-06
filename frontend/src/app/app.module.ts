import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './layout/auth/auth/auth.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './layout/home/home.component';
import { LoginComponent } from './layout/auth/login/login.component';
import { RegisterComponent } from './layout/auth/register/register.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LogoComponent } from './layout/header/logo/logo.component';
import { LogoComponent2 } from './layout/footer/logo/logo2.component';
import { MenuComponent } from './layout/menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyInterceptor } from './httpInterceptor';
import { LayoutComponent } from './layout/layout.component';
import { PopupComponent } from './popup/popup.component';
import { ProductListComponent } from './layout/home/product-list/product-list.component';
import { AdminPageComponent } from './layout/admin-page/admin-page.component';
import { AddProductComponent } from './layout/admin-page/add-product/add-product.component';
import { EditProductComponent } from './layout/admin-page/edit-product/edit-product.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CartComponent } from './cart/cart.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderComponent } from './order/order.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { OrderCompleteComponent } from './order-complete/order-complete.component';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    LogoComponent,
    LogoComponent2,
    PopupComponent,
    ProductListComponent,
    AdminPageComponent,
    AddProductComponent,
    EditProductComponent,
    CartComponent,
    OrderSummaryComponent,
    OrderComponent,
    OrderCompleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    SplitButtonModule,
    ButtonModule,
    TabViewModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,

      useClass: MyInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
