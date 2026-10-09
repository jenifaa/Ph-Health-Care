import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.services";
import { StatusCodes } from "http-status-codes";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.loginUser(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  loginUser,
};
