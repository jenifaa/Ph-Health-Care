import { Router } from "express";
import { DoctorController } from "./user.controller";


const router = Router();

router.post("/", DoctorController.createDoctor);

export const DoctorRoutes = router;