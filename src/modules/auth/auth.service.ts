import { comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";
import { UnauthorizedError } from "../../utils/errors/httpErrors";
import { userLogin } from "../user/user.service";

type AuthProvider = "local" | "google";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: AuthProvider;
}

interface AuthLoginData {
  email: string;
  password: string;
}

interface AuthLoginPayload {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

const DEFAULT_EXPIRES_IN_SECONDS = 3600;

const buildDisplayName = (row: Record<string, unknown>): string => {
  const first = typeof row.firstname === "string" ? row.firstname : "";
  const last = typeof row.lastname === "string" ? row.lastname : "";
  const username = typeof row.username === "string" ? row.username : "";
  const email = typeof row.email === "string" ? row.email : "";
  const fullName = `${first} ${last}`.trim();

  if (fullName) {
    return fullName;
  }

  if (username) {
    return username;
  }

  return email;
};

const mapLocalUser = (row: Record<string, unknown>): AuthUser => {
  const id = String(row.id ?? "");
  const email = typeof row.email === "string" ? row.email : "";
  const avatarUrl =
    typeof row.avatar_url === "string" ? row.avatar_url : undefined;

  return {
    id,
    email,
    name: buildDisplayName(row),
    ...(avatarUrl ? { avatarUrl } : {}),
    provider: "local",
  };
};

export const loginWithEmailPassword = async (
  credentials: AuthLoginData,
): Promise<AuthLoginPayload> => {
  const rows = await userLogin(credentials);

  if (!rows.length) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const userRow = rows[0] as Record<string, unknown>;
  const hashedPassword =
    typeof userRow.password === "string" ? userRow.password : "";

  const isPasswordValid = await comparePassword(
    credentials.password,
    hashedPassword,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const accessToken = generateToken(String(userRow.id));

  return {
    accessToken,
    expiresIn: DEFAULT_EXPIRES_IN_SECONDS,
    user: mapLocalUser(userRow),
  };
};
