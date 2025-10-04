import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await deleteSession();

    return NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while signing out",
        error: "Failed to sign out",
      },
      { status: 500 }
    );
  }
}
