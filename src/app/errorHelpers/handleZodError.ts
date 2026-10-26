import status from "http-status-codes";
import z from "zod";
import { TErrorResponse, TErrorSource } from "../interfaces/error.interface";

export const handleZodError = (err: z.ZodError): TErrorResponse => {
  const statusCode: number = status.INTERNAL_SERVER_ERROR;

  const message: string = "Internal Server Error";

  const errorSource: TErrorSource[] = [];

  err.issues.forEach((issue) => {
    errorSource.push({
      path: issue.path.join(".") || "unknown",
      message: issue.message,
    });
  });

  return {
    success: false,
    message,
    errorSource,
    statusCode,
  };
};
