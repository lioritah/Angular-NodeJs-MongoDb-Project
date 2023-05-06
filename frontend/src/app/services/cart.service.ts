import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, of, share, Subscription } from 'rxjs';
import { get, postSubscribe } from '../httpInterceptor';
import { CartProduct } from '../models/cart-product.model';
import { Cart } from '../models/cart.model';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { ExceptionsService } from './exceptions.service';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnDestroy {
  $cart = new BehaviorSubject<Cart | null>(null);
  $cartItems = new BehaviorSubject<CartProduct[]>([]);

  $orderComplete = new BehaviorSubject<Order | null>(null);
  // הרשמה להאזנה של נתונים
  subscription: Subscription | undefined;
  constructor(
    private httpClient: HttpClient,
    private exceptionService: ExceptionsService,
    public popupService: PopupService,
    private router: Router
  ) {
    this.subscription = this.getAllCartProducts();

    // this will be called with non null order
    // when an order is submitted through order-summary component
    this.$orderComplete.subscribe((order) => {
      if (order) {
        // order success -> show modal with order info
      }
    });
  }

  // ביטול האזנה
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAllCartProducts() {
    return get<{ cart: Cart; cartItems: CartProduct[] }>(
      'cart',
      this.httpClient,
      this.exceptionService
    ).subscribe((data) => {
      if (data) {
        this.$cart.next(data.cart);
        this.$cartItems.next(
          data.cartItems.map((cartItem) => ({
            ...cartItem,
            totalPrice: cartItem.product.price * cartItem.stock,
          }))
        );
      }
    });
  }

  async onSubmitOrder(order: Order) {
    try {
      const result = await postSubscribe<{ newOrder: Order; newCart: Cart }>(
        'order/',
        order,
        this.httpClient,
        this.exceptionService
      );
      const totalPrice = this.$cartItems.value.reduce(
        (prev, next) => prev + next.product.price * next.stock,
        0
      );
      this.$orderComplete.next({
        ...result.newOrder,
        totalPrice: totalPrice,
      });
      this.$cart.next(result.newCart);
    } catch (e) {
      this.popupService.showError(e);
      this.router.navigateByUrl('/cart');
    }
  }

  async onAddProductToCart(product: Product) {
    const data = { product, stock: 1 };
    const cartItems = this.$cartItems.value;
    const existing = cartItems.findIndex(
      (item) => item.product._id === product._id
    );

    if (existing !== -1) {
      cartItems[existing].stock++;
      this.$cartItems.next(cartItems);
    }

    const result = await postSubscribe<CartProduct & { cart: Cart }>(
      'cart/product',
      data,
      this.httpClient,
      this.exceptionService
    );
    if (existing === -1) {
      this.$cartItems.next([
        ...cartItems,
        { ...result, totalPrice: result.stock * result.product.price },
      ]);
    }
    this.popupService.showInfo(`${product.name} added`);
  }

  onRemoveProductToCart(product: Product) {
    const cartItems = this.$cartItems.value;
    const existing = cartItems.findIndex(
      (item) => item.product._id === product._id
    );
    let removed = false;
    if (existing !== -1) {
      cartItems[existing].stock--;
      if (cartItems[existing].stock === 0) {
        removed = true;
        cartItems.splice(existing, 1);
        this.$cartItems.next(cartItems);
      }
    } else {
      cartItems[existing].stock === 0;
    }
    this.httpClient
      .post<CartProduct & { cart: Cart }>('cart/product', {
        product,
        stock: -1,
      })
      .subscribe((addedProduct) => {
        if (!removed && addedProduct) this.$cart.next(addedProduct.cart);
      });
    this.popupService.showError(`${product.name} removed`);
  }
}
