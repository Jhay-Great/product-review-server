import { NextFunction, Request, Response } from "express";
import { comparePassword } from "../utils/hash";
import {
  userLogin,
  userRegistration,
  createPasswordResetRequest,
  verifyPasswordResetToken,
  updatePassword,
} from "../services/pg-services/userServices";
import { generateToken } from "../utils/jwt";
import { NotFoundError, UnauthorizedError, ConflictError, BadRequestError } from "../utils/errors/httpErrors";
import { sendResetPasswordEmail } from "../utils/email";

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

export const forgottenPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const result = await createPasswordResetRequest(email);

    // Always respond with a generic message to avoid leaking account existence
    if (!result) {
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const frontend = process.env.FRONTEND_URL || 'http://localhost:4200';
    const resetUrl = `${frontend}/reset-password?token=${result.token}&email=${encodeURIComponent(result.email)}`;

    console.log('about to create mail');
    const messagePreview = await sendResetPasswordEmail(result.email, resetUrl);
    console.log(messagePreview);

    return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, token, password } = req.body;

  try {
    if (!email || !token || !password) throw new BadRequestError('Missing required fields');

    const verified = await verifyPasswordResetToken(email, token);
    if (!verified) throw new BadRequestError('Invalid or expired token');

    await updatePassword(verified.id, password);

    return res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = (req: Request, res: Response) => {};
