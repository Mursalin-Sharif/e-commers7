import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "paki_session";

export type SessionPayload = {
  userId: string;
  role: string;
  name: string;
  phone: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return new TextEncoder().encode(secret);

  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    throw new Error("JWT_SECRET environment variable is required in production");
  }

  return new TextEncoder().encode("paki-dev-secret-change-in-production-2026");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function isStaffRole(role: string) {
  return role === "ADMIN" || role === "MODERATOR";
}

/** MongoDB ObjectId — invalid after SQLite → MongoDB migration. */
export function isValidObjectId(id: string) {
  return /^[a-f0-9]{24}$/i.test(id);
}
