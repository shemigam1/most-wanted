"use server";

import { compare, hash } from "bcrypt";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import * as jose from "jose";
import { cache } from "react";

// JWT types
interface JWTPayload {
  userId: string;
  [key: string]: string | number | boolean | null | undefined;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!!!"
);

const JWT_EXPIRATION = "7d"; // 7 days

const REFRESH_THRESHOLD = 24 * 60 * 60; // 24 hours in seconds

export async function hashPassword(password: string) {
  return hash(password, 10);
}

// Verify a password
export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

// Create a new user
export async function createUser(
  username: string,
  email: string,
  password: string
) {
  const hashedPassword = await hashPassword(password);
  const id = nanoid();

  try {
    await db.insert(users).values({
      id,
      username,
      email,
      password: hashedPassword,
    });

    return { id, email };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

// Generate a JWT token
export async function generateJWT(payload: JWTPayload) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);
}

// Verify a JWT token
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// Check if token needs refresh
export async function shouldRefreshToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      clockTolerance: 15, // 15 seconds tolerance for clock skew
    });

    const exp = payload.exp as number;
    const now = Math.floor(Date.now() / 1000);

    return exp - now < REFRESH_THRESHOLD;
  } catch {
    return false;
  }
}

export async function createSession(userId: string) {
  try {
    const token = await generateJWT({ userId });

    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    });

    return true;
  } catch (error) {
    console.error("Error creating session:", error);
    return false;
  }
}

// Get current session from JWT
export const getSession = cache(async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;
    const payload = await verifyJWT(token);

    return payload ? { userId: payload.userId } : null;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("During prerendering, `cookies()` rejects")
    ) {
      console.log(
        "Cookies not available during prerendering, returning null session"
      );
      return null;
    }

    console.error("Error getting session:", error);
    return null;
  }
});

// Delete session by clearing the JWT cookie
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}
