import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import {  UserService } from "./user.services";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";


const createDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;

        const result = await UserService.createDoctor(payload);

        sendResponse(res, {
            httpStatusCode: httpStatus.CREATED,
            success: true,
            message: "Doctor registered successfully",
            data: result,
        })
    }
)

export const DoctorController = {
  createDoctor,
};