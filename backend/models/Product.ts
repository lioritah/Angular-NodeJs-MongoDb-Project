import mongoose, { ObjectId } from "mongoose";

export interface Product extends mongoose.Document<ObjectId> {
  category: mongoose.Schema.Types.ObjectId;
  image: string;
  name: string;
  price: number;
}

const ProductSchema = new mongoose.Schema<Product>(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
    },
    image: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "name must be provided for a product"],
    },
    price: {
      type: Number,
      required: [true, "price must be provided for a product"],
    },
  },
  { versionKey: false }
);

const ProductModel = mongoose.model("ProductModel", ProductSchema, "products");

export default ProductModel;
