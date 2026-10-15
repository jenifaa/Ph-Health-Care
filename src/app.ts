import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notForund";
import cookieParser from "cookie-parser"
const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser())

app.use("/api/v1/", IndexRoutes);

app.get("/", async (req: Request, res: Response) => {
  const specialty = await prisma.specialty.create({
    data: {
      title: "Cardiology",
    },
  });
  res.status(200).json(specialty);
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
