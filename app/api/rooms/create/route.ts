import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/app/db";
import { rooms } from "@/app/db/schema";
import { getCurrentUser } from "@/lib/dal";
import { generateRoomCode } from "@/lib/utils";
import { revalidateTag } from "next/cache";

// Define Zod schema for room validation
const RoomSchema = z.object({
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

export async function POST(request: NextRequest) {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
          error: "You must be logged in to create a room",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const validationResult = RoomSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      message: "Room created successfully",
      data: {
        id: newRoom.id,
        code: newRoom.code,
        name: newRoom.name,
      },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while creating the room",
        error: "Failed to create room",
      },
      { status: 500 }
    );
  }
}
