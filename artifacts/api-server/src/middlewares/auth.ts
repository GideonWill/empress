import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from "../lib/jwt";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined = undefined;

  // 1. Try to read from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Try to read from accessToken cookie
  if (!token && req.cookies) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const payload = verifyAccessToken(token);
      (req as any).user = { id: payload.userId, email: payload.email };
      return next();
    } catch (err: any) {
      // Access token is invalid or expired, continue to check refresh token
    }
  }

  // 3. Silent refresh: Check refresh token cookie
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    try {
      const refreshPayload = verifyRefreshToken(refreshToken);

      // Verify user exists in the database
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, refreshPayload.userId))
        .limit(1);

      if (user) {
        // Generate new access token
        const newAccessToken = generateAccessToken(user);

        // Set as cookie
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // Set response header so client can update local state if needed
        res.setHeader("x-access-token", newAccessToken);

        (req as any).user = { id: user.id, email: user.email };
        return next();
      }
    } catch (err) {
      // Refresh token is expired or invalid
    }
  }

  res.status(401).json({ error: "Unauthorized. Please sign in." });
}
