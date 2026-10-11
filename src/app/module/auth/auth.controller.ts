import {  Request, Response } from "express";
import { AuthService } from "./auth.services";

import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import  status  from "http-status-codes";

const registerPatient = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthService.registerPatient(payload);
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Patient registered successfully",
      data: result,
    });
  },
);
const loginUser = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthService.loginUser(payload);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  },
);




export const AuthController = {
  registerPatient,
  loginUser,

};
