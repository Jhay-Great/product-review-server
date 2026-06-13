import { NextFunction, Request, Response } from "express";
import {
  userRegistration,
  createPasswordResetRequest,
  verifyPasswordResetToken,
  updatePassword,
} from "./user.service";
import { ConflictError, BadRequestError } from "../../utils/errors/httpErrors";
import { sendResetPasswordEmail } from "../../utils/email";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const registrationData = req.body;

  try {
    const response = await userRegistration(registrationData);

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: response,
    });
  } catch (error: unknown) {
    if ((error as any)?.code === '23505') {
      return next(new ConflictError('Email already in use'));
    }
    return next(error);
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

    await sendResetPasswordEmail(result.email, resetUrl);

    return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, token, password } = req.body;

  try {
    const verified = await verifyPasswordResetToken(email, token);
    if (!verified) throw new BadRequestError('Invalid or expired token');

    await updatePassword(verified.id, password);

    return res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error) {
    return next(error);
  }
};

