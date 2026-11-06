import StatusCodes from "http-status-codes";

import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    where: {
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
      appointments: {
        include: {
          patient: true,
          schedule: true,
          prescription: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      reviews: true,
    },
  });

  return doctor;
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });
  if (!isDoctorExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Doctor not FOund");
  }

  const { doctor: doctorData, specialties } = payload;

  await prisma.$transaction(async (tx) => {
    if (doctorData) {
      await tx.doctor.update({
        where: {
          id,
        },
        data: {
          ...doctorData,
        },
      });
    }

    if (specialties && specialties.length > 0) {
      for (const specialty of specialties) {
        const { specialtyId, shouldDelete } = specialty;
        if (shouldDelete) {
          await tx.doctorSpecialty.delete({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
          });
        } else {
          await tx.doctorSpecialty.upsert({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
            create: {
              doctorId: id,
              specialtyId,
            },
            update: {},
          });
        }
      }
    }
  });

  const doctor = await getDoctorById(id);

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
