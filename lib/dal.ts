import { db } from "@/app/db";
import { getSession } from "./auth";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { users } from "@/app/db/schema";
import { unstable_cacheTag as cacheTag } from "next/cache";

// Current user
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  if (
    typeof window === "undefined" &&
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return null;
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId));
    console.log(result[0]);

    return result[0] || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
});

// Get user by email
export const getUserByEmail = cache(async (email: string) => {
  try {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
});
