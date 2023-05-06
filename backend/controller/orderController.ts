import { Router } from "express";
import { getUserCart } from "../logic/cartLogic";
import {
  createNewOrder,
  deleteOrder,
  getUserOrderById,
  getUserOrders,
  isValidOrderDate,
  updateOrder,
} from "../logic/orderLogic";
import { getProducts } from "../logic/productLogic";
import { AuthorizedRequest } from "../middleware/validateToken";

const router = Router();

// GET ALL USER ORDERS
router.get("/", async function (request: AuthorizedRequest, response, next) {
  try {
    const orders = await getUserOrders(request.userId);
    return response.status(201).json(orders);
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

// GET SINGLE USER ORDER
router.get(
  "/one/:id",
  async function (request: AuthorizedRequest, response, next) {
    try {
      const orders = await getUserOrderById(request.params.id);
      return response.status(201).json(orders);
    } catch (error) {
      request.statusCode = error.status;
      next(error);
    }
  }
);

// CREATE AN ORDER
router.post("/", async function (request: AuthorizedRequest, response, next) {
  try {
    const orderData = request.body;
    await isValidOrderDate(orderData);
    const newOrder = await createNewOrder(request.userId, orderData);
    const newCart = await getUserCart(request.userId);
    return response.status(201).json({ newOrder, newCart });
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

// CREATE AN ORDER
router.put("/", async function (request: AuthorizedRequest, response, next) {
  try {
    const orderData = request.body;
    const newOrder = await updateOrder(request.userId, orderData);
    return response.status(201).json(newOrder);
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

// DELETE AN ORDER by id from parameters
router.delete(
  "/:id",
  async function (request: AuthorizedRequest, response, next) {
    try {
      const deletedOrder = await deleteOrder(request.params.id);
      return response.status(201).json(deletedOrder);
    } catch (error) {
      request.statusCode = error.status;
      next(error);
    }
  }
);

export default router;
