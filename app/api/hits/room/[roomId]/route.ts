import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { hit, rooms } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/dal";
import { Nomination } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
          error: "You must be logged in to view targets",
        },
        { status: 401 }
      );
    }

    const { roomId } = await params;

    // Verify room exists
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "Room not found",
          error: "The room does not exist",
        },
        { status: 404 }
      );
    }

    // Get all hits for the room
    const hits: Nomination[] = await db
      .select()
      .from(hit)
      .where(eq(hit.roomId, roomId))
      .orderBy(hit.createdAt);

    return NextResponse.json({
      success: true,
      message: "Targets retrieved successfully",
      data: hits,
    });
  } catch (error) {
    console.error("Error getting hits:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while retrieving targets",
        error: "Failed to get hits",
      },
      { status: 500 }
    );
  }
}
