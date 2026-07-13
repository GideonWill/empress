import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_access_secret_key_please_change";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret_key_please_change";

export interface JWTPayload {
  userId: number;
  email: string;
}

export function generateAccessToken(user: { id: number; email: string }): string {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(user: { id: number; email: string }): string {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
}
