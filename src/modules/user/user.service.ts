import pool from "../../config/database";
import { hashPassword } from "../../utils/hash";
import { randomBytes, createHash } from "crypto";
import { UserLogin, UserRegistration } from "../../types/models";

export const userLogin = async (loginData: UserLogin) => {
  const { email } = loginData;
  const { rows } = await pool.query(`SELECT * FROM USERS WHERE email = $1`, [
    email,
  ]);
  return rows;
};

export const userRegistration = async (registrationData: UserRegistration) => {
  const { firstname, lastname, email, username, password } = registrationData;
  const hashedPassword = await hashPassword(password);

  const { rows } = await pool.query(
    `INSERT INTO users (firstname, lastname, email, username, password)
        VALUES ($1, $2, $3, $4, $5) RETURNING firstname, lastname, email, username`,
    [firstname, lastname, email, username, hashedPassword]
  );

  return rows;
};

export const createPasswordResetRequest = async (email: string) => {
  const {
    rows: users,
  } = await pool.query(`SELECT id, email FROM users WHERE email = $1`, [email]);

  if (users.length === 0) return null;

  const user = users[0];

  // generate raw token and a sha256 hash to store
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await pool.query(
    `UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3`,
    [tokenHash, expiresAt, user.id]
  );

  return { id: user.id, email: user.email, token: rawToken };
};

export const verifyPasswordResetToken = async (email: string, token: string) => {
  const {
    rows: users,
  } = await pool.query(
    `SELECT id, password_reset_token, password_reset_expires FROM users WHERE email = $1`,
    [email]
  );

  if (users.length === 0) return null;

  const user = users[0];

  if (!user.password_reset_token || !user.password_reset_expires) return null;

  const tokenHash = createHash("sha256").update(token).digest("hex");

  const expires = new Date(user.password_reset_expires);
  if (tokenHash !== user.password_reset_token) return null;
  if (expires < new Date()) return null;

  return { id: user.id };
};

export const updatePassword = async (userId: number, newPassword: string) => {
  const hashed = await hashPassword(newPassword);
  await pool.query(
    `UPDATE users SET password = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2`,
    [hashed, userId]
  );
  return true;
};
