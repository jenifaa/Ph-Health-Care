import dotenv from "dotenv";
import AppError from "../app/errorHelpers/AppError";
import StatusCodes from "http-status-codes";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  DATABASE_URL: string;
  PORT: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredVariables = [
    "NODE_ENV",
    "DATABASE_URL",
    "PORT",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
  ];

  for (const variable of requiredVariables) {
    if (!process.env[variable]) {
      // throw new Error(`Environment variable '${variable}' is not set`);
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not in .env file`,
      );
    }
  }
  return {
    NODE_ENV: process.env.NODE_ENV as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    PORT: process.env.PORT as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  };
};

export const envVars: EnvConfig = loadEnvVariables();
