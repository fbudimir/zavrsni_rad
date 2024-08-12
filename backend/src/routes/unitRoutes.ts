import { Router } from "express";
import unitController from "../controllers/unitController";

const router = Router();

router.get("/", unitController.getAllUnits);
router.get("/:id", unitController.getUnitById);
router.post("/", unitController.createUnit);
router.put("/:id", unitController.updateUnit);
router.delete("/:id", unitController.deleteUnit);

router.post("/deleteMany", unitController.deleteMultipleUnits);
router.post("/availableUnits", unitController.getAvailableUnits);
router.post("/addSoldiers", unitController.addSoldiers);
router.post("/removeSoldiers", unitController.removeSoldiers);
router.post("/addSubUnits", unitController.addSubUnits);
router.post("/removeSubUnits", unitController.removeSubUnits);
router.post("/eligibleLeaders", unitController.getEligibleLeaders);
router.post("/incompleteOrders", unitController.getIncompleteOrders);
router.post("/addOrders", unitController.addOrders);
router.post("/removeOrders", unitController.removeOrders);
router.post("/addEquipment", unitController.addEquipment);
router.post("/removeEquipment", unitController.removeEquipment);
router.post("/activeDirectOrders", unitController.getActiveDirectOrders);
router.post("/activeIndirectOrders", unitController.getActiveIndirectOrders);

export default router;
