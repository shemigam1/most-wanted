import { db } from "@/app/db";
import { getSession } from "./auth";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { users } from "@/app/db/schema";
// import { mockDelay } from "./utils";
import { unstable_cacheTag as cacheTag } from "next/cache";

// Current user
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  // Skip database query during prerendering if we don't have a session
  // hack until we have PPR https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering
  if (
    typeof window === "undefined" &&
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return null;
  }

  //   await mockDelay(700);
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
