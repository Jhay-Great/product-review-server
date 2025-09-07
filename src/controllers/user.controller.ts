import { Request, Response } from "express";
import { comparePassword } from "../utils/harsh";
import { userLogin, userRegistration } from "../services/pg-services/userServices";
import { generateToken } from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
    const loginData = req.body;

    try {
        // call login service
        const response = await userLogin(loginData);

        if (response.length === 0) {
            res.status(401).json({
                success: false,
                message: "Email does not exist"
            })
            return;
        }
        
        const hashedPassword = response[0].password;
        const isMatch = await comparePassword(loginData.password, hashedPassword);
        
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            });
            return;
        }

        const { password, ...userData } = response[0];
        const { id } = userData;
        const token = generateToken(id);
    
        res.status(200).json({
            success: true,
            message: 'Login successfully',
            data: userData,
            token,
        })
        
    } catch (error) {
        throw error;
    }

}

export const register = async (req: Request, res: Response) => {
    const registrationData = req.body;

    try {
        // service call
        const response = await userRegistration(registrationData);

        res.status(200).json({
            success: true,
            message: 'Login successfully',
            data: response,
        })

    } catch (error:unknown) {
        if (error instanceof Error) { // refactor later (handle it properly)
            res.status(401).json({
                success: false,
                meesage: 'Duplicate email',
            });
            return;
        }
        throw error;
    }
}

export const forgottenPassword = (req: Request, res: Response) => {}

export const deleteUser = (req: Request, res: Response) => {

}
