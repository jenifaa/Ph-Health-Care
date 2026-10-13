import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { DoctorService } from "./user.services";


const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await DoctorService.createDoctor(req.body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const DoctorController = {
  createDoctor,
};