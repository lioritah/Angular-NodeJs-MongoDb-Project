import { Router } from "express";
import userController from "./userController";
import orderController from "./orderController";
import adminController from "./adminController";
import productController from "./productController";
import cartController from "./cartController";
import validateToken from "../middleware/validateToken";
import validateAdminToken from "../middleware/validateAdminToken";

const router = Router();
router.use("/auth", userController);
router.use("/product", productController);
router.use("/cart", validateToken, cartController);
router.use("/admin", validateAdminToken, adminController);
router.use("/order", validateToken, orderController);
export default router;
