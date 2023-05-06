import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    public authService: AuthService,
    public productService: ProductsService
  ) {}

  onChangeCategory(category: any) {
    this.productService.filterProductsByCategory(category);
  }
}
