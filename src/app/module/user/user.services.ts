
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const {  doctor } = payload;

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: doctor.name,
        email: doctor.email,
        role: "DOCTOR",
      },
    });

    const createdDoctor = await tx.doctor.create({
      data: {
        name: doctor.name,
        email: doctor.email,
      
      },
    });

    return createdDoctor;
  });

  return result;
};

export const DoctorService = {
  createDoctor,
};
