"use server";

import { db } from "@/app/db";
import { rooms } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/dal";
import { z } from "zod";
import { generateRoomCode } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth";
import { getHitsByRoom } from "./hit";
import { Router } from "lucide-react";

export interface RoomDataDub {
  id: string;
  name: string;
  description?: string | null;
  code?: string;
}

// Define Zod schema for room validation
const RoomSchema = z.object({
  // id: z,
  name: z
    .string()
    .min(3, "Room name must be at least 3 characters")
    .max(50, "Room name must be less than 50 characters"),

  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional()
    .nullable(),
});

export type RoomData = z.infer<typeof RoomSchema>;

export type ActionResponse = {
  success: boolean;
  message: string;
  data?: {
    id: string;
    code: string;
    name: string;
  };
  errors?: Record<string, string[]>;
  error?: string;
};

export async function createRoom(data: RoomData): Promise<ActionResponse> {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized access",
        error: "You must be logged in to create a room",
      };
    }

    // Validate with Zod
    const validationResult = RoomSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    // Generate unique room code
    const roomCode = generateRoomCode();

    // Create room with validated data
    const validatedData = validationResult.data;
    const [newRoom] = await db
      .insert(rooms)
      .values({
        name: validatedData.name,
        description: validatedData.description || null,
        code: roomCode,
        userId: user.id,
      })
      .returning();

    revalidateTag("rooms");

    return {
      success: true,
      message: "Room created successfully",
      data: {
        id: newRoom.id,
        code: newRoom.code,
        name: newRoom.name,
      },
    };
  } catch (error) {
    console.error("Error creating room:", error);
    return {
      success: false,
      message: "An error occurred while creating the room",
      error: "Failed to create room",
    };
  }
}

export async function deleteRoom(roomId: string): Promise<ActionResponse> {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized access",
        error: "You must be logged in to delete a room",
      };
    }

    // Check if room exists and user owns it
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room) {
      return {
        success: false,
        message: "Room not found",
        error: "The room you are trying to delete does not exist",
      };
    }

    // Verify ownership
    if (room.userId !== user.id) {
      return {
        success: false,
        message: "Forbidden",
        error: "You can only delete rooms that you created",
      };
    }

    // Delete room
    await db.delete(rooms).where(eq(rooms.id, roomId));

    revalidateTag("rooms");

    return {
      success: true,
      message: "Room deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting room:", error);
    return {
      success: false,
      message: "An error occurred while deleting the room",
      error: "Failed to delete room",
    };
  }
}

export async function getRoomByCode(code: string): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized access",
        error: "You must be logged in to join a room",
      };
    }

    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.code, code.toUpperCase()))
      .limit(1);

    if (!room) {
      return {
        success: false,
        message: "Room not found",
        error: "No room found with that code",
      };
    }

    return {
      success: true,
      message: "Room found",
      data: {
        id: room.id,
        code: room.code,
        name: room.name,
      },
    };
  } catch (error) {
    console.error("Error finding room:", error);
    return {
      success: false,
      message: "An error occurred while finding the room",
      error: "Failed to find room",
    };
  }
}

export async function fetchRoomData(code: string, roomId: string) {
  try {
    // Verify session
    const session = await getSession();
    if (!session?.userId) {
      return;
    }

    // Fetch room data using your existing functions
    const roomResponse = await getRoomByCode(code);
    const hitsResponse = await getHitsByRoom(code, roomId);
    console.log(hitsResponse, "hits response");
    console.log(roomResponse, "room response");

    return {
      roomResponse,
      hitsResponse,
      userId: session.userId,
    };
  } catch (error) {
    console.error("Error fetching room data:", error);
    return;
  }
}
