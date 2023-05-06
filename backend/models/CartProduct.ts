import mongoose, { ObjectId } from "mongoose";
import { Product } from "./Product";

export interface CartProduct extends mongoose.Document<ObjectId> {
  cart: mongoose.Schema.Types.ObjectId;
  stock: number;
  totalPrice: number;
  product: mongoose.Schema.Types.ObjectId;
}

const CartProductSchema = new mongoose.Schema<CartProduct>(
  {
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartModel",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductModel",
    },
    stock: {
      type: Number,
      required: [true, "stock must be provided for a cart product"],
    },
  },
  { versionKey: false }
);

CartProductSchema.virtual("totalPrice").get(async function () {
  await this.populate("product");
  const product = this.product as any as Product;
  return product.price * this.stock;
});

const CartProductModel = mongoose.model(
  "CartProductModel",
  CartProductSchema,
  "cart_products"
);

export default CartProductModel;
