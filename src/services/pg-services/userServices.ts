import pool from "../../config/db.pgConfig"
import { hashPassword } from "../../utils/harsh";
import { UserLogin, UserRegistration } from "../../models/product.interface"

export const userLogin = async (loginData:UserLogin) => {
    const { email } = loginData;
    const { rows } = await pool.query(
        `SELECT * FROM USERS WHERE email = $1`, [email]
    );
    return rows;
}

export const userRegistration = async (registrationData:UserRegistration) => {
    const { firstname, lastname, email, username, password } = registrationData;
    const hashedPassword = await hashPassword(password);

    const { rows } = await pool.query(
        `INSERT INTO users (firstname, lastname, email, username, password) 
        VALUES ($1, $2, $3, $4, $5) RETURNING firstname, lastname, email, username`,
        [firstname, lastname, email, username, hashedPassword]
    );

    return rows;
}