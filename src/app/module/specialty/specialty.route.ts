import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";

const router = Router();

router.post("/create", SpecialtyController.createSpecialty);
router.get("/getAll", SpecialtyController.getAllSpecialties);
router.patch("/:id", SpecialtyController.updateSpecialty);
router.delete("/:id", SpecialtyController.deleteSpecialty);

export const SpecialtyRoutes = router;
