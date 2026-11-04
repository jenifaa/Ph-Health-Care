

import status from "http-status-codes";
import { ICreateAdminPayload, ICreateDoctorPayload } from "./user.interface";
import { Role, Specialty } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialties: Specialty[] = [];

  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: {
        id: specialtyId,
      },
    });
    if (!specialty) {
      throw new AppError(
        status.NOT_FOUND,
        `Specialty with id ${specialtyId} not found`,
      );
    }
    specialties.push(specialty);
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (userExists) {
    // throw new Error("User with this email already exists");
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      name: payload.doctor.name,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });

      const doctorSpecialtyData = specialties.map((specialty) => {
        return {
          doctorId: doctorData.id,
          specialtyId: specialty.id,
        };
      });

      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtyData,
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  title: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      return doctor;
    });

    return result;
  } catch (error) {
    console.log("Transaction error : ", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};



const createAdmin = async (payload: ICreateAdminPayload) => {

  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email,
    },
  });

  if (userExists) {
    throw new Error("User with this email already exists");
  }

  // Step 2: Create user account with Better Auth
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: Role.ADMIN,
      name: payload.admin.name,
      needPasswordChange: true,
      rememberMe: false,
    },
  });


  // try {
  //   const result = await prisma.$transaction(async (tx) => {
  //     // Create admin record
  //     const admin = await tx.admin.create({
  //       data: {
  //         userId: userData.user.id,
  //         name: payload.admin.name,
  //         email: payload.admin.email,
  //         profilePhoto: payload.admin.profilePhoto,
  //         contactNumber: payload.admin.contactNumber,
  //       },
  //     });

  //     // Fetch created admin with user data
  //     const createdAdmin = await tx.admin.findUnique({
  //       where: { id: admin.id },
  //       select: {
  //         id: true,
  //         name: true,
  //         email: true,
  //         profilePhoto: true,
  //         contactNumber: true,
  //         isDeleted: true,
  //         createdAt: true,
  //         updatedAt: true,
  //         user: {
  //           select: {
  //             id: true,
  //             name: true,
  //             email: true,
  //             role: true,
  //             status: true,
  //           },
  //         },
  //       },
  //     });

  //     return createdAdmin;
  //   });

  //   return result;
  // } catch (error) {
    
  //   await prisma.user.delete({
  //     where: { id: userData.user.id },
  //   });
  //   throw new Error("Failed to create admin");
  // }
};



export const UserService = {
  createDoctor,
  createAdmin,
};
