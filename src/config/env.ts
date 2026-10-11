import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  DATABASE_URL: string;
  PORT: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredVariables = [
    "NODE_ENV",
    "DATABASE_URL",
    "PORT",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
  ];

  for (const variable of requiredVariables) {
    if (!process.env[variable]) {
      throw new Error(`Environment variable '${variable}' is not set`);
    }
  }
  return {
    NODE_ENV: process.env.NODE_ENV as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    PORT: process.env.PORT as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
  };
};

export const envVars: EnvConfig = loadEnvVariables();
