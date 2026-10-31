/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import StatusCodes from "http-status-codes";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../../config/env";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new Error("Unauthorized access!!, No session token provided");
      }
      if (sessionToken) {
        const sessionExist = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExist && sessionExist.user) {
          const user = sessionExist.user;

          const now = new Date();
          const expiresAt = new Date(sessionExist.expiresAt);
          const createdAt = new Date(sessionExist.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();

          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time_Remaining", timeRemaining.toString());

            console.log("Session expires soon!!");
          }

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              StatusCodes.UNAUTHORIZED,
              "Unauthorized access! User is not active",
            );
          }
          if (user.isDeleted) {
            throw new AppError(
              StatusCodes.UNAUTHORIZED,
              "Unauthorized access! User is not active",
            );
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              StatusCodes.FORBIDDEN,
              "Forbidden access! You do not have permission to access this resources",
            );
          }
        }

        const accessToken = cookieUtils.getCookie(req, "accessToken");
        if (!accessToken) {
          throw new AppError(
            StatusCodes.UNAUTHORIZED,
            "UnAuthorized access! No access token provide",
          );
        }
      }

      const accessToken = cookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized Access!!");
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );
      if (!verifiedToken.success) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized Access!!");
      }

      if (verifiedToken.data!.role !== "ADMIN") {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized Access!!");
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
