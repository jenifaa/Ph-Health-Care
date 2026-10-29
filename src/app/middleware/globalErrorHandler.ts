/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status-codes";
import z from "zod";
import { TErrorResponse, TErrorSource } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
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

  let stack:string |undefined = undefined

  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);

    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSource.push(...simplifiedError.errorSource);
    stack = err.stack
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR as number;
    message = err.message;
    stack = err.stack
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSource,
    stack: envVars.NODE_ENV === "development" ? stack : undefined,
    error: envVars.NODE_ENV === "development" ? err : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
