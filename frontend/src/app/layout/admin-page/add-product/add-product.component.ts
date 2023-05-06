import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NewProduct } from 'src/app/models/product.model';
import { AdminService } from 'src/app/services/admin.service';
import { PopupService } from 'src/app/services/popup.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  constructor(
    public adminService: AdminService,
    private formBuilder: FormBuilder,
    private popupService: PopupService,
    public productService: ProductsService,

    private router: Router
  ) {}

  selectedProductImage: string | undefined;

  onSelectImage(input: any) {
    const reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    reader.onload = () => {
      this.selectedProductImage = reader.result as string;
    };
  }
  addProductForm = this.formBuilder.group({
    category: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
  });

  get category() {
    return this.addProductForm.get('category');
  }
  get image() {
    return this.addProductForm.get('image');
  }
  get name() {
    return this.addProductForm.get('name');
  }
  get price() {
    return this.addProductForm.get('price');
  }

  onSubmitAddProduct() {
    const category = this.addProductForm.value.category!!;
    const name = this.addProductForm.value.name!!;
    const price = this.addProductForm.value.price!!;
    if (!this.selectedProductImage) {
      return this.popupService.showError('Please select an image');
    }
    const newProduct = {
      category,
      name,
      image: this.selectedProductImage,
      price,
    };

    this.adminService.addProduct(newProduct);
    this.productService.getAllProducts();
    this.router.navigateByUrl('/home');
  }
  onChangeCategory(category: any) {
    this.adminService.filterProductsByCategory(category);
  }
}
