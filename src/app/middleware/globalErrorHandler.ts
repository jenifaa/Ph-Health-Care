/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status-codes";
import z from "zod";
import { TErrorResponse, TErrorSource } from "../interfaces/error.interface";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from global error handler", err);
  }

  const errorSource: TErrorSource[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;

  let message: string = "Internal Server Error";

  if (err instanceof z.ZodError) {
    statusCode = status.BAD_REQUEST;
    message = "Zod Validation Error";

    err.issues.forEach((issue) => {
      errorSource.push({
        path: issue.path.join(".") || "unknown",
        message: issue.message,
      });
    });
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSource,
    error: envVars.NODE_ENV === "development" ? err : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
