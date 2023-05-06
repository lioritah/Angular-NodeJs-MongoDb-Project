import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { AdminService } from 'src/app/services/admin.service';
import { PopupService } from 'src/app/services/popup.service';
import { ProductsService } from 'src/app/services/products.service';

// Reactive Form
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent {
  productId = this.activatedRoute.snapshot.params['id'];

  editProductForm = this.formBuilder.group({
    category: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    image: ['', [Validators.required]],
  });

  constructor(
    public adminService: AdminService,
    public productService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private popupService: PopupService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.adminService.getProductById(this.productId);
  }
  selectedProductImage: string | undefined;
  onSelectImage(input: any) {
    const reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    reader.onload = () => {
      this.selectedProductImage = reader.result as string;
    };
  }

  get category() {
    return this.editProductForm.get('category');
  }
  get image() {
    return this.editProductForm.get('image');
  }
  get name() {
    return this.editProductForm.get('name');
  }
  get price() {
    return this.editProductForm.get('price');
  }

  onSubmitEditProduct() {
    const category = this.editProductForm.value.category!!;
    const name = this.editProductForm.value.name!!;
    const image = this.selectedProductImage;
    const price = this.editProductForm.value.price!!;

    if (!image) {
      return this.popupService.showError('Please select an image');
    }
    const editedProduct = {
      category,
      name,
      image,
      price,
      ...this.productId,
    } as Product;
    this.adminService.editProduct(editedProduct, this.productId);
    this.productService.getAllProducts();
    this.router.navigateByUrl('/home');
  }
  onChangeCategory(category: any) {
    this.adminService.filterProductsByCategory(category);
  }
}
