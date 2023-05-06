import { Router } from "express";
import { getCategories, getProducts } from "../logic/productLogic";

const router = Router();

// GET ALL PRODUCTS
router.get("/", async function (request, response, next) {
  try {
    const products = await getProducts();
    return response.status(201).json(products);
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

// GET ALL CATEGORIES
router.get("/category", async function (request, response, next) {
  try {
    const categories = await getCategories();
    console.log(categories);
    return response.status(201).json(categories);
  } catch (error) {
    request.statusCode = error.status;
    next(error);
  }
});

export default router;
