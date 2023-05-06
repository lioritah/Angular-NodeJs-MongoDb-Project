import CategoryModel from "../models/Category";
import ProductModel from "../models/Product";
// get all products
async function getProducts() {
  const products = await ProductModel.find({}).populate("category").exec();
  return products;
}
// get all categories
async function getCategories() {
  const categories = await CategoryModel.find({}).exec();
  return categories;
}

export { getProducts, getCategories };
