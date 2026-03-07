import { NextFunction, Request, Response } from "express";
import { comparePassword } from "../utils/hash";
import {
  userLogin,
  userRegistration,
} from "../services/pg-services/userServices";
import { generateToken } from "../utils/jwt";
import { NotFoundError, UnauthorizedError, ConflictError } from "../utils/errors/httpErrors";

export const login = async (req: Request, res: Response) => {
  const loginData = req.body;

  try {
    // call login service
    const response = await userLogin(loginData);

    if (response.length === 0) {
      throw new NotFoundError("Email does not exist");
    }

    const hashedPassword = response[0].password;
    const isMatch = await comparePassword(loginData.password, hashedPassword);

    if (!isMatch) {
      throw new UnauthorizedError("Password is incorrect");
    }

    const { password, ...userData } = response[0];
    const { id } = userData;
    const token = generateToken(id);

    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: userData,
      token,
    });
  } catch (error) {
    throw error;
  }
};

export const register = async (req: Request, res: Response, next:NextFunction) => {
  const registrationData = req.body;

  try {
    // service call
    const response = await userRegistration(registrationData);

    res.status(200).json({
      success: true,
      message: "Login successfully",
      data: response,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // refactor later (handle it properly)
      return next(new ConflictError("Duplicate email"));
    }
    throw error;
  }
};

export const forgottenPassword = (req: Request, res: Response) => {};

export const deleteUser = (req: Request, res: Response) => {};
