// "use server";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword, createSession } from "@/lib/auth";
import { getUserByEmail } from "@/lib/dal";

// Define Zod schema for signin validation
const SignInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validationResult = SignInSchema.safeParse(body);
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

    const { email, password } = validationResult.data;

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
          errors: {
            email: ["Invalid email or password"],
          },
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
          errors: {
            password: ["Invalid email or password"],
          },
        },
        { status: 401 }
      );
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      message: "Signed in successfully",
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while signing in",
        error: "Failed to sign in",
      },
      { status: 500 }
    );
  }
}
