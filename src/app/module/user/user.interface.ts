

import { Gender } from "../../../generated/prisma/enums";



export interface ICreateDoctorPayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;

    registrationNumber: string;
    experience?: number;
    gender: Gender;
    appointmentPlace: string;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
  };
}
