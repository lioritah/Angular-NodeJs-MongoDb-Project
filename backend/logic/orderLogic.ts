import {
  CartNotFoundException,
  ValidationException,
} from "../exceptions/exceptions";
import { DecodedToken } from "../middleware/validateToken";
import CartModel from "../models/Cart";
import CartProductModel from "../models/CartProduct";
import OrderModel, { Order } from "../models/Order";

// create new order with order details
// fetch the cart by userId
// and create the order with the given cart
async function createNewOrder(user: DecodedToken, order: Partial<Order>) {
  let cart = await CartModel.findOne({ user, status: "pre-order" }).exec();

  if (!cart) {
    throw new CartNotFoundException("No cart was found for user " + user);
  }

  cart.status = "post-order";
  cart = await cart.save();
  const newOrder = new OrderModel({ ...order, user, cart: cart._id });
  // validate order
  await newOrder.validate();
  return await newOrder.save();
}

async function isValidOrderDate(order: Partial<Order>) {
  let orders = await OrderModel.find({});
  const orderDateAttempt = new Date(order.deliveryDate);
  const orderDateDay = orderDateAttempt.getDate();
  const orderDateMonth = orderDateAttempt.getMonth();
  const orderDateYear = orderDateAttempt.getFullYear();

  if (
    orders.filter((someOtherOrder) => {
      const date = new Date(someOtherOrder.deliveryDate);
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      return (
        day == orderDateDay && orderDateMonth == month && orderDateYear == year
      );
    }).length >= 3
  ) {
    throw new ValidationException(
      "The requested delivery date is not available"
    );
  }
}

// get all orders for a user by user id
async function getUserOrders(user: DecodedToken) {
  const orders = await OrderModel.find({ user }).exec();
  return orders;
}

// get a single order by id
async function getUserOrderById(orderId: string) {
  const order = await OrderModel.findById(orderId).exec();
  return order;
}

// order is a partial of ORder , updating order by userId
async function updateOrder(
  user: DecodedToken,
  order: Partial<Order>
): Promise<Order> {
  const orderModelUpdated = await OrderModel.findOneAndUpdate(
    { user },
    order
  ).exec();
  return orderModelUpdated;
}

// delete order by userId
async function deleteOrder(orderId: string): Promise<Order> {
  const orderModelDeleted = await OrderModel.findByIdAndDelete(orderId).exec();
  return orderModelDeleted;
}

export {
  createNewOrder,
  getUserOrders,
  getUserOrderById,
  updateOrder,
  isValidOrderDate,
  deleteOrder,
};
