import z from "zod";

export const updateDoctorZodSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    doctor: z
      .object({
        name: z.string().min(1, "Name is required").optional(),
        email: z.email("Invalid email address").optional(),
        profilePhoto: z.url("Invalid profile photo URL").optional(),
        contactNumber: z.string().optional(),
        address: z.string().optional(),
        registrationNumber: z
          .string()
          .min(1, "Registration number is required")
          .optional(),
        experience: z.number().int().min(0).optional(),
        gender: z.enum(["MALE", "FEMALE"]).optional(),
        appointmentFee: z.number().min(0).optional(),
        qualification: z.string().min(1).optional(),
        currentWorkingPlace: z.string().min(1).optional(),
        designation: z.string().min(1).optional(),
      })
      .partial()
      .optional(),
    specialties: z.array(z.string().uuid()).optional(),
  })
  .partial();
