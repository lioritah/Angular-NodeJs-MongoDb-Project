import mongoose, { ObjectId } from "mongoose";

export interface Category extends mongoose.Document<ObjectId> {
  categoryName: string;
}

const CategorySchema = new mongoose.Schema<Category>(
  {
    categoryName: {
      type: String,
      required: [true, "category name must be provided"],
    },
  },
  { versionKey: false }
);

const CategoryModel = mongoose.model(
  "CategoryModel",
  CategorySchema,
  "categories"
);

export default CategoryModel;
