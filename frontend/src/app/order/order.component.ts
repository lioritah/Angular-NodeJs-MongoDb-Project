import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public popupService: PopupService
  ) {}
}
