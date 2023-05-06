import { DecodedToken } from "../middleware/validateToken";
import CartModel, { Cart } from "../models/Cart";
import CartProductModel, { CartProduct } from "../models/CartProduct";
import { Product } from "../models/Product";

async function createNewCart(user: DecodedToken) {
  const cartModel = new CartModel({ user });
  //validate cart
  await cartModel.validate();
  return await cartModel.save();
}

async function getUserCart(user: DecodedToken) {
  let cartModel = await CartModel.findOne({ user, status: "pre-order" }).exec();
  if (!cartModel) {
    // user has no cart yet
    cartModel = await new CartModel({
      user,
    }).save();
  }
  return cartModel;
}

async function getUserCartProducts(cart: String) {
  const cartModel = await CartProductModel.find({ cart })
    .populate("product")
    .exec();
  return cartModel;
}

// cart is a partial of Cart , updating cart by userId
async function updateCart(
  user: DecodedToken,
  cart: Partial<Cart>
): Promise<Cart> {
  const cartModelUpdated = await CartModel.findOneAndUpdate(
    { user },
    cart
  ).exec();
  return cartModelUpdated;
}

// delete cart by userId
async function deleteCart(user: DecodedToken): Promise<Cart> {
  const cartModelDeleted = await CartModel.findOneAndDelete({ user }).exec();
  return cartModelDeleted;
}

// add a product to a cart

// cart is a partial of Cart , updating cart by userId
async function addCartProduct(
  user: DecodedToken,
  product: Product,
  stock: number
): Promise<CartProduct> {
  let cartModel = await CartModel.findOne({ user, status: "pre-order" }).exec();
  if (!cartModel) {
    // user has no cart yet
    cartModel = await new CartModel({
      user,
    }).save();
  }

  // check if the product exists in cart
  const existingCartProduct = await CartProductModel.findOne({
    product,
    cart: cartModel,
  }).exec();
  if (existingCartProduct) {
    // last stock of product -> remove item
    if (stock <= 0 && existingCartProduct.stock + stock <= 0) {
      return await CartProductModel.findByIdAndDelete(
        existingCartProduct._id
      ).exec();
    }

    // product exists -> update stock
    existingCartProduct.stock += stock;
    existingCartProduct.stock = Math.max(1, existingCartProduct.stock);
    return await existingCartProduct.save();
  } else {
    const newCartProduct = new CartProductModel({
      product,
      stock,
    });
    newCartProduct.cart =
      cartModel._id; /* assign cart id to the new cart product  */
    newCartProduct.product = product._id;
    await newCartProduct.validate();
    return await (
      await newCartProduct.save()
    ).populate([
      {
        path: "cart",
        model: "CartModel",
      },
      {
        path: "product",
        model: "ProductModel",
      },
    ]);
  }
}

// delete a cart product by the product id
async function deleteCartProduct(productId: string): Promise<CartProduct> {
  const cartProductDeleted = await CartProductModel.findByIdAndDelete(
    productId
  ).exec();
  return cartProductDeleted;
}

// update a product that is in an existing cart by product id
async function updateCartProduct(
  productId: string,
  product: Partial<CartProduct>
): Promise<CartProduct> {
  const cartProductModelUpdated = await CartProductModel.findByIdAndUpdate(
    productId,
    product
  ).exec();
  return cartProductModelUpdated;
}

export {
  createNewCart,
  getUserCart,
  updateCart,
  getUserCartProducts,
  deleteCart,
  addCartProduct,
  deleteCartProduct,
  updateCartProduct,
};
