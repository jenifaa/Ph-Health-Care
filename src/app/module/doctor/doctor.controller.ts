import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { DOctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendResponse";
import httpStatus from "http-status-codes";
const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await DOctorService.getAllDoctors();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Doctor fetched successfully",
    data: result,
  });
});
export const DoctorController = {
  getAllDoctors,
};
