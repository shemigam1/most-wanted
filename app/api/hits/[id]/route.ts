import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { hit } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/dal";
import { revalidateTag } from "next/cache";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
          error: "You must be logged in to delete a target",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if hit exists and user owns it
    const [existingHit] = await db
      .select()
      .from(hit)
      .where(eq(hit.id, id))
      .limit(1);

    if (!existingHit) {
      return NextResponse.json(
        {
          success: false,
          message: "Target not found",
          error: "The target you are trying to delete does not exist",
        },
        { status: 404 }
      );
    }

    // Verify ownership - only the user who nominated can delete
    if (existingHit.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
          error: "You can only delete targets that you nominated",
        },
        { status: 403 }
      );
    }

    // Delete hit
    await db.delete(hit).where(eq(hit.id, id));

    revalidateTag("hits");
    revalidateTag(`hits-${existingHit.roomId}`);

    return NextResponse.json({
      success: true,
      message: "Target deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hit:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting the target",
        error: "Failed to delete hit",
      },
      { status: 500 }
    );
  }
}
