import mongoose, { ObjectId } from "mongoose";

export interface Cart extends mongoose.Document<ObjectId> {
  user: mongoose.Schema.Types.ObjectId;
  creationDate: Date;
  status: String;
}

const CartSchema = new mongoose.Schema<Cart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    creationDate: {
      type: Date,
      default: new Date(),
    },
    status: {
      type: String,
      enum: ["pre-order", "post-order"],
      default: "pre-order",
    },
  },
  { versionKey: false }
);

const CartModel = mongoose.model("CartModel", CartSchema, "carts");

export default CartModel;
