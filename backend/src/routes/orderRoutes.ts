import { Router } from "express";
import orderController from "../controllers/orderController";

const router = Router();

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

router.post("/deleteMany", orderController.deleteMultipleOrders);
router.post("/availableOrders", orderController.getAvailableOrders);
router.post("/addUnits", orderController.addUnits);
router.post("/removeUnits", orderController.removeUnits);
router.post("/updateMapData", orderController.updateMapData);

export default router;
