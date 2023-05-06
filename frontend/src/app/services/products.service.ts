import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, share, Subject } from 'rxjs';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { ExceptionsService } from './exceptions.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  $products = new BehaviorSubject<Product[]>([]);
  $showingProducts = new BehaviorSubject<Product[]>([]);
  $categories = new BehaviorSubject<Category[]>([]);
  constructor(
    private httpClient: HttpClient,
    private exceptionService: ExceptionsService
  ) {
    this.getAllProducts();
    this.getAllCategories();
  }

  getAllProducts() {
    const subscription = this.httpClient
      .get<Product[]>('product')
      .pipe(share())
      .pipe((res) => {
        // Exception handling
        catchError(async (err) => this.exceptionService.handleError(err));
        return res;
      })
      .subscribe((productsResponse) => {
        // make a subscription to the products
        // update the behavior subject with the response
        // cache all the products
        this.$products.next(productsResponse);
        // the actual products to show (may be filtered)
        this.$showingProducts.next(productsResponse);
        subscription.unsubscribe(); // we need to unsubscribe
      });
  }

  filterProductsByCategory(category: string) {
    if ((category as any) == -1) {
      // GENERAL CATEGORY (ALL PRODUCTS)
      this.$showingProducts.next(this.$products.value);
      return;
    }
    // filter by category
    let products = this.$products.value;
    let filtered = products.filter(
      (product) => (product.category as any)._id === category
    );
    this.$showingProducts.next(filtered);
  }

  getAllCategories() {
    const subscription = this.httpClient
      .get<Category[]>('product/category')
      .pipe(share())
      .pipe((res) => {
        // Exception handling
        catchError(async (err) => this.exceptionService.handleError(err));
        return res;
      })
      .subscribe((categoriesResponse) => {
        // make a subscription to the products
        // update the behavior subject with the response
        this.$categories.next(categoriesResponse);
        subscription.unsubscribe(); // we need to unsubscribe
      });
  }
}
