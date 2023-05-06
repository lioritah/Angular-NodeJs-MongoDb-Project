import { Router } from "express";
import {
  createNewCart,
  getUserCart,
  updateCart,
  deleteCart,
  addCartProduct,
  getUserCartProducts,
} from "../logic/cartLogic";
import { AuthorizedRequest } from "../middleware/validateToken";

const router = Router();

// CREATE CART - MIGHT DELETE
router.post("/", async function (request: AuthorizedRequest, response, next) {
  try {
    const createdCart = await createNewCart(request.userId);
    console.log(createdCart);
    return response.status(201).json(createdCart);
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

router.post(
  "/product",
  async function (request: AuthorizedRequest, response, next) {
    try {
      const { product, stock } = request.body;
      const addedProduct = await addCartProduct(request.userId, product, stock);
      return response.status(201).json(addedProduct);
    } catch (error) {
      request.statusCode = error.status;
      next(error);
    }
  }
);

// UPDATE CART - My be deleted soon
router.put("/", async function (request: AuthorizedRequest, response, next) {
  try {
    const cart = request.body;
    const updatedCart = await updateCart(request.userId, cart);
    console.log("Updated Cart: " + JSON.stringify(updatedCart));
    return response.status(201).json(updatedCart);
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

// DELETE CART
router.delete("/", async function (request: AuthorizedRequest, response, next) {
  try {
    const deletedCart = await deleteCart(request.userId);
    console.log("Deleted Cart: " + JSON.stringify(deletedCart));
    return response.status(201).json(deletedCart);
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

// GET CART ROUTE
router.get("/", async function (request: AuthorizedRequest, response, next) {
  try {
    // מחזיר את העגלה
    const cart = await getUserCart(request.userId);
    // מחזיר את המוצרים בעגלה
    const cartItems = await getUserCartProducts(String(cart._id));
    return response.status(201).json({ cart, cartItems });
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

export default router;
