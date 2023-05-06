import CategoryModel from "../models/Category";
import ProductModel, { Product } from "../models/Product";

// create new product with product details
// and create the product with the given product details
async function createNewProduct(product: Partial<Product>) {
  const newProductModel = new ProductModel(product);
  // validate product
  await newProductModel.validate();
  return await newProductModel.save();
}

// create new product with product details
// and create the product with the given product details
async function createNewCategory(categoryName: string) {
  const newCategoryModel = new CategoryModel({ categoryName });
  // validate product
  await newCategoryModel.validate();
  return await newCategoryModel.save();
}

// order is a partial of Order , updating order by userId
async function updateProduct(
  productId: string,
  product: Partial<Product>
): Promise<Product> {
  const productModelUpdated = await ProductModel.findByIdAndUpdate(
    productId,
    product,
    { returnOriginal: false } /*  returns product after update */
  ).exec();
  return productModelUpdated;
}

// delete product by id
async function deleteProduct(productId: string): Promise<Product> {
  const productModelDeleted = await ProductModel.findByIdAndDelete(
    productId
  ).exec();
  return productModelDeleted;
}

async function getProductById(productId: string) {
  const product = await ProductModel.findById(productId).exec();
  return product;
}
export {
  createNewProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  createNewCategory,
};
