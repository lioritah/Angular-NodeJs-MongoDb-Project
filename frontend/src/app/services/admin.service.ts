import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, share } from 'rxjs';
import { Category } from '../models/category.model';
import { NewProduct, Product } from '../models/product.model';
import { ExceptionsService } from './exceptions.service';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  $newProduct = new BehaviorSubject<NewProduct | null>(null);
  $product = new BehaviorSubject<Product | null>(null);
  $products = new BehaviorSubject<Product[]>([]);
  $showingProducts = new BehaviorSubject<Product[]>([]);
  $categories = new BehaviorSubject<Category[]>([]);
  constructor(
    private httpClient: HttpClient,
    private exceptionService: ExceptionsService,
    public productService: ProductsService
  ) {
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

  getProductById(id: string) {
    const subscription = this.httpClient
      .get<Product>(`admin/${id}`)
      .pipe(share())
      .pipe((res) => {
        // Exception handling
        catchError(async (err) => this.exceptionService.handleError(err));
        return res;
      })
      .subscribe((product) => {
        // make a subscription to the products
        // update the behavior subject with the response
        this.$product.next(product);
        subscription.unsubscribe(); // we need to unsubscribe
      });
  }

  addProduct(product: NewProduct) {
    const newProduct = this.httpClient
      .post<NewProduct>('admin', product)
      .subscribe((addedProduct) => {
        this.$newProduct.next(addedProduct);
        newProduct.unsubscribe();
      });
    this.getAllProducts();
  }

  editProduct(product: Product, id: string) {
    const updateProduct = this.httpClient
      .put<Product>(`admin/${id}`, product)
      .pipe(share())
      .pipe((res) => {
        // Exception handling
        catchError(async (err) => this.exceptionService.handleError(err));
        return res;
      })
      .subscribe((product) => {
        // make a subscription to the products
        // update the behavior subject with the response
        this.$product.next(product);

        updateProduct.unsubscribe(); // we need to unsubscribe
      });
    this.getAllProducts();
  }
}
