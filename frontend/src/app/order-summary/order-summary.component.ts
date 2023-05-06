import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from '../models/order.model';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent {
  orderForm = new FormGroup({
    deliveryDate: new FormControl('', [Validators.required]),
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/),
    ]),
  });
  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public popupService: PopupService,
    private router: Router
  ) {
    this.cartService.getAllCartProducts();
  }

  submitOrder() {
    if (!this.orderForm.valid)
      return this.popupService.showError(
        'Please fill all the fields and make sure credit card is valid'
      );
    const cart = this.cartService.$cart.value;
    const cartItems = this.cartService.$cartItems.value;
    const user = this.authService.user.value;
    if (!cart || !user) {
      return this.popupService.showError('Unknown error has occurred');
    }
    if (!cartItems || cartItems.length < 1) {
      return this.popupService.showError('Your cart is empty..');
    }
    const today = new Date();
    const deliveryDate = new Date(this.orderForm.controls.deliveryDate.value!);
    const cardNumberLast4Digits =
      this.orderForm.controls.cardNumber.value!.split('-')[3];
    const order = {
      cart: cart!._id,
      user: user!._id,
      deliveryDate: deliveryDate,
      orderDate: today,
      deliveryStreet: user.addressStreet,
      deliveryCity: user.addressCity,
      cardLast4Digits: cardNumberLast4Digits,
      totalPrice: cartItems.reduce((prev, next) => prev + next.totalPrice, 0),
    } as Order;

    try {
      this.cartService.onSubmitOrder(order);
      this.router.navigateByUrl('/order-complete');
      return this.popupService.orderComplete('Order successful !');
    } catch (e) {
      console.log(e);
    }
  }
}
