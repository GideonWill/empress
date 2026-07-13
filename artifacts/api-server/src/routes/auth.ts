import { Router } from "express";
import { verifyGoogleToken } from "../lib/verify-google";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt";
import { requireAuth } from "../middlewares/auth";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../lib/password";

const router = Router();

// POST /auth/google
router.post("/auth/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    res.status(400).json({ error: "Google credential token is required." });
    return;
  }

  try {
    const googleUser = await verifyGoogleToken(credential);

    // Check if user exists by email
    let [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, googleUser.email))
      .limit(1);

    if (!user) {
      // Create new user record
      [user] = await db
        .insert(usersTable)
        .values({
          googleId: googleUser.googleId,
          fullName: googleUser.fullName,
          email: googleUser.email,
          profileImage: googleUser.profileImage,
          authProvider: "google",
        })
        .returning();
    } else if (!user.googleId) {
      // If user exists but has no googleId, link it
      [user] = await db
        .update(usersTable)
        .set({
          googleId: googleUser.googleId,
          profileImage: googleUser.profileImage || user.profileImage,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, user.id))
        .returning();
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token in HttpOnly cookie as well for automatic credentials association
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({
      id: user.id,
      googleId: user.googleId,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err: any) {
    res.status(401).json({ error: `Authentication failed: ${err.message}` });
  }
});

// GET /auth/profile
router.get("/auth/profile", requireAuth, async (req: any, res) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id))
      .limit(1);

    if (!user) {
       res.status(404).json({ error: "User not found." });
       return;
    }

    res.json({
      id: user.id,
      googleId: user.googleId,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/logout
router.post("/auth/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

// POST /auth/register
router.post("/auth/register", async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    res.status(400).json({ error: "Email, password, and full name are required." });
    return;
  }

  try {
    // Check if email already exists
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (existing) {
      res.status(400).json({ error: "Email is already registered." });
      return;
    }

    const passwordHash = hashPassword(password);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        fullName,
        email: email.toLowerCase(),
        passwordHash,
        authProvider: "local",
      })
      .returning();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Set refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token in HttpOnly cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(201).json({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      profileImage: newUser.profileImage,
      authProvider: newUser.authProvider,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (err: any) {
    res.status(500).json({ error: `Registration failed: ${err.message}` });
  }
});

// POST /auth/login
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token in HttpOnly cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err: any) {
    res.status(500).json({ error: `Login failed: ${err.message}` });
  }
});

export default router;
