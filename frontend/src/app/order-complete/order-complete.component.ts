import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { PopupService } from '../services/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.scss'],
})
export class OrderCompleteComponent implements OnDestroy {
  constructor(
    public cartService: CartService,
    public popupService: PopupService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnDestroy(): void {
    this.cartService.$orderComplete.next(null);
    this.cartService.$cartItems.next([]);
  }

  toDateString(value: any) {
    const date = new Date(value).toLocaleDateString();
    const components = date.split('/');
    const temp = components[0];
    components[0] = components[1];
    components[1] = temp;
    return components.join('/');
  }

  downloadReceipt() {
    let receipt = `delivery date: ${this.cartService.$orderComplete.value?.deliveryDate}
    order Date: ${this.cartService.$orderComplete.value?.orderDate}
    delivery street: ${this.authService.user.value?.addressStreet}
    delivery City: ${this.authService.user.value?.addressCity}
      card Last 4 Digits:
      ${this.cartService.$orderComplete.value?.cardLast4Digits}
    total Price: ${this.cartService.$orderComplete.value?.totalPrice}`;
    const a = document.createElement('a');
    a.style.opacity = '0';
    a.href = 'data:text/plain;charset=UTF-8, ' + receipt;
    a.download = 'receipt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
