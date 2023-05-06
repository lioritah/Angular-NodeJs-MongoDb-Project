import { Router } from "express";
import {
  createNewCategory,
  createNewProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from "../logic/adminLogic";
import {
  createNewCart,
  getUserCart,
  updateCart,
  deleteCart,
} from "../logic/cartLogic";
import { AuthorizedRequest } from "../middleware/validateToken";

const router = Router();

// GET PRODUCT BY ID

router.get("/:id", async function (request, response, next) {
  try {
    const product = await getProductById(request.params.id);
    console.log(product);
    return response.status(201).json(product);
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

// CREATE PRODUCT
router.post("/", async function (request: AuthorizedRequest, response, next) {
  try {
    const product = request.body;
    const createdProduct = await createNewProduct(product);
    console.log(createdProduct);
    return response.status(201).json(createdProduct);
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});
// CREATE PRODUCT
router.post(
  "/category",
  async function (request: AuthorizedRequest, response, next) {
    try {
      const { categoryName } = request.body;
      const createdCategory = await createNewCategory(categoryName);
      console.log(createdCategory);
      return response.status(201).json(createdCategory);
    } catch (error) {
      request.statusCode = error.status;
      next(error);
    }
  }
);

// UPDATE Product
router.put("/:id", async function (request: AuthorizedRequest, response, next) {
  try {
    const productData = request.body;
    const updatedCart = await updateProduct(request.params.id, productData);
    console.log("Updated Product: " + JSON.stringify(updatedCart));
    return response.status(201).json(updatedCart);
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

// DELETE PRODUCT
router.delete(
  "/:id",
  async function (request: AuthorizedRequest, response, next) {
    try {
      const deletedProduct = await deleteProduct(request.params.id);
      console.log("Deleted Product: " + JSON.stringify(deletedProduct));
      return response
        .status(201)
        .json({ deletedProduct, status: "DELETED SUCCESSFULLY" });
    } catch (error) {
      request.statusCode = error.status;
      next(error);
    }
  }
);

export default router;
