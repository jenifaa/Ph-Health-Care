import { Doctor } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return doctors;
};

const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });

  return doctor;
};

const updateDoctor = async (id: string, payload: Partial<Doctor>) => {
  const doctor = await prisma.doctor.update({
    where: {
      id,
      isDeleted: false,
    },
    data: payload,
  });

  return doctor;
};

const deleteDoctor = async (id: string) => {
  const doctor = await prisma.doctor.update({
    where: {
      id,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });

  return doctor;
};

export const DoctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
