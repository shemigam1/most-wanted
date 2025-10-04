import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/app/db";
import { hit, rooms } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/dal";
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

export async function POST(request: NextRequest) {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
          error: "You must be logged in to nominate a target",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const validationResult = HitSchema.safeParse(body);
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

    const validatedData = validationResult.data;

    // Verify room exists and user has access
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, validatedData.roomId))
      .limit(1);

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "Room not found",
          error: "The room you are trying to add a target to does not exist",
        },
        { status: 404 }
      );
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

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Error creating hit:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while nominating the target",
        error: "Failed to create hit",
      },
      { status: 500 }
    );
  }
}
