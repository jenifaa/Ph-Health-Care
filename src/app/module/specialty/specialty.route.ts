import { NextFunction, Request, Response, Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { cookieUtils } from "../../utils/cookie";
import AppError from "../../errorHelpers/AppError";
import StatusCodes from "http-status-codes";

import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";

const router = Router();

router.post("/create", SpecialtyController.createSpecialty);
router.get(
  "/getAll",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = cookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized Access!!");
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );
      if (!verifiedToken.success) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized Access!!");
      }

      if (verifiedToken.data!.role !== "ADMIN") {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized Access!!");
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  SpecialtyController.getAllSpecialties,
);
router.patch("/:id", SpecialtyController.updateSpecialty);
router.delete("/:id", SpecialtyController.deleteSpecialty);

export const SpecialtyRoutes = router;
