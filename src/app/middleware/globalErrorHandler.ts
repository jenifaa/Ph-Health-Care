import { NextFunction, Request, Response } from "express";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);

  res.status(500).json({
    success: false,
    message: "Internal server Error",
    error: err.message,
  });
};
