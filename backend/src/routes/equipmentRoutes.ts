import { Router } from "express";
import equipmentController from "../controllers/equipmentController";

const router = Router();

router.get("/", equipmentController.getAllEquipment);
router.get("/:id", equipmentController.getEquipmentById);
router.post("/", equipmentController.createEquipment);
router.put("/:id", equipmentController.updateEquipment);
router.delete("/:id", equipmentController.deleteEquipment);

router.post("/deleteMany", equipmentController.deleteMultipleEquipment);
router.post("/availableEquipment", equipmentController.getAvailableEquipment);

export default router;
