import { sendResponse } from "../../shared/sendResponse";
import status from "http-status-codes";
import { AdminService } from "./admin.service";
import { catchAsync } from "../../shared/catchAsync";
import { Request, Response } from "express";
const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmins();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Admins fetched successfully",
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
};
