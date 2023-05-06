import mongoose, { ObjectId } from "mongoose";
import { Cart } from "./Cart";
import CartProductModel, { CartProduct } from "./CartProduct";
import { Product } from "./Product";

export interface Order extends mongoose.Document<ObjectId> {
  cart: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  deliveryDate: Date;
  orderDate: Date;
  deliveryStreet: string;
  deliveryCity: string;
  cardLast4Digits: string;
  totalPrice: number;
}

const OrderSchema = new mongoose.Schema<Order>(
  {
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartModel",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    deliveryDate: {
      type: Date,
      required: [true, "delivery date must be provided to an order"],
    },
    orderDate: {
      type: Date,
      default: new Date(),
    },
    cardLast4Digits: {
      type: String,
      required: [
        true,
        "payment method last 4 digits must be provided for a order",
      ],
    },
  },
  { versionKey: false }
);

OrderSchema.virtual("totalPrice").get(async function () {
  const cart_products = await CartProductModel.find({ cart: this.cart }).exec();
  const cart_products_totalPrice = cart_products.reduce(
    (prev: number, product: CartProduct) => prev + product.totalPrice,
    0
  );
  return cart_products_totalPrice;
});

const OrderModel = mongoose.model("OrderModel", OrderSchema, "orders");

export default OrderModel;
