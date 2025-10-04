import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { rooms } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/dal";
import { revalidateTag } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
          error: "You must be logged in to join a room",
        },
        { status: 401 }
      );
    }

    const { code } = await params;
    console.log(code, "api params");

    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.code, code.toUpperCase()))
      .limit(1);

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "Room not found",
          error: "No room found with that code",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Room found",
      data: {
        id: room.id,
        code: room.code,
        name: room.name,
      },
    });
  } catch (error) {
    console.error("Error finding room:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while finding the room",
        error: "Failed to find room",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
          error: "You must be logged in to delete a room",
        },
        { status: 401 }
      );
    }

    const { code } = await params;

    // Check if room exists and user owns it
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.code, code))
      .limit(1);

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "Room not found",
          error: "The room you are trying to delete does not exist",
        },
        { status: 404 }
      );
    }

    // Verify ownership
    if (room.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
          error: "You can only delete rooms that you created",
        },
        { status: 403 }
      );
    }

    // Delete room
    await db.delete(rooms).where(eq(rooms.code, code));

    revalidateTag("rooms");

    return NextResponse.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting the room",
        error: "Failed to delete room",
      },
      { status: 500 }
    );
  }
}
