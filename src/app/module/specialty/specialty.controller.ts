import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.service";

const createSpecialty = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await SpecialtyService.createSpecialty(payload);

    res.status(201).json({
      success: true,
      message: "Specialty created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
const getAllSpecialties = async (req: Request, res: Response) => {
  try {
    const result = await SpecialtyService.getAllSpecialties();

    res.status(201).json({
      success: true,
      message: "Specialties retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteSpecialty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params ;
    const result = await SpecialtyService.deleteSpecialty(id as string);

    res.status(201).json({
      success: true,
      message: "Specialty deleted successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateSpecialty = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SpecialtyService.updateSpecialty(
    id as string,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Specialty updated successfully",
    data: result,
  });
};


export const SpecialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty,
};

