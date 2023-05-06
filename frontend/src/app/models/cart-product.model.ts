import { Product } from './product.model';

export type CartProduct = {
  _id: string;
  cart: string;
  stock: number;
  totalPrice: number;
  product: Product;
};
