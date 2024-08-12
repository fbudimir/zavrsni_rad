import { Router } from "express";
import soldierController from "../controllers/soldierController";

const router = Router();

router.get("/", soldierController.getAllSoldiers);
router.get("/:id", soldierController.getSoldierById);
router.post("/", soldierController.createSoldier);
router.put("/:id", soldierController.updateSoldier);
router.delete("/:id", soldierController.deleteSoldier);

router.post("/deleteMany", soldierController.deleteMultipleSoldiers);
router.post("/availableSoldiers", soldierController.getAvailableSoldiers);

export default router;
