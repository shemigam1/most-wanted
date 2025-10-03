"use server";

import { db } from "@/app/db";
import { hit, rooms } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/dal";
import { z } from "zod";
import { revalidateTag } from "next/cache";

// Define Zod schema for hit validation
const HitSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  offense: z
    .string()
    .max(500, "Offense description must be less than 500 characters")
    .optional()
    .nullable(),

  roomId: z.string().min(1, "Room ID is required"),
});

export type HitData = z.infer<typeof HitSchema>;

export type HitActionResponse = {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    offense: string | null;
    userId: string;
    roomId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  errors?: Record<string, string[]>;
  error?: string;
};

export type ActionResponse = {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
  error?: string;
};

export async function createHit(data: HitData): Promise<HitActionResponse> {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized access",
        error: "You must be logged in to nominate a target",
      };
    }

    // Validate with Zod
    const validationResult = HitSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const validatedData = validationResult.data;

    // Verify room exists and user has access
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, validatedData.roomId))
      .limit(1);

    if (!room) {
      return {
        success: false,
        message: "Room not found",
        error: "The room you are trying to add a target to does not exist",
      };
    }

    // Create hit with validated data
    const [newHit] = await db
      .insert(hit)
      .values({
        name: validatedData.name,
        offense: validatedData.offense || null,
        roomId: validatedData.roomId,
        userId: user.id,
      })
      .returning();

    revalidateTag("hits");
    revalidateTag(`hits-${validatedData.roomId}`);

    return {
      success: true,
      message: "Target nominated successfully",
      data: {
        id: newHit.id,
        name: newHit.name,
        offense: newHit.offense,
        userId: newHit.userId,
        roomId: newHit.roomId,
        createdAt: newHit.createdAt,
        updatedAt: newHit.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error creating hit:", error);
    return {
      success: false,
      message: "An error occurred while nominating the target",
      error: "Failed to create hit",
    };
  }
}

export async function deleteHit(hitId: string): Promise<ActionResponse> {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized access",
        error: "You must be logged in to delete a target",
      };
    }

    // Check if hit exists and user owns it
    const [existingHit] = await db
      .select()
      .from(hit)
      .where(eq(hit.id, hitId))
      .limit(1);

    if (!existingHit) {
      return {
        success: false,
        message: "Target not found",
        error: "The target you are trying to delete does not exist",
      };
    }

    // Verify ownership - only the user who nominated can delete
    if (existingHit.userId !== user.id) {
      return {
        success: false,
        message: "Forbidden",
        error: "You can only delete targets that you nominated",
      };
    }

    // Delete hit
    await db.delete(hit).where(eq(hit.id, hitId));

    revalidateTag("hits");
    revalidateTag(`hits-${existingHit.roomId}`);

    return {
      success: true,
      message: "Target deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting hit:", error);
    return {
      success: false,
      message: "An error occurred while deleting the target",
      error: "Failed to delete hit",
    };
  }
}

export type GetHitsResponse = {
  success: boolean;
  message: string;
  data?: Array<{
    id: string;
    name: string;
    offense: string | null;
    userId: string;
    roomId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  error?: string;
};

export async function getHitsByRoom(
  code: string,
  roomId: string
): Promise<GetHitsResponse> {
  try {
    const user = await getCurrentUser();
    console.log(user, "current user");

    if (!user) {
      return {
        success: false,
        message: "Unauthorized access",
        error: "You must be logged in to view targets",
      };
    }

    // Verify room exists
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.code, code.toUpperCase()))
      .limit(1);

    if (!room) {
      return {
        success: false,
        message: "Room not found",
        error: "The room does not exist",
      };
    }

    // Get all hits for the room
    const hits = await db
      .select()
      .from(hit)
      .where(eq(hit.roomId, roomId))
      .orderBy(hit.createdAt);

    return {
      success: true,
      message: "Targets retrieved successfully",
      data: hits,
    };
  } catch (error) {
    console.error("Error getting hits:", error);
    return {
      success: false,
      message: "An error occurred while retrieving targets",
      error: "Failed to get hits",
    };
  }
}
