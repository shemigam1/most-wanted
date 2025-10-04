import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession, createUser } from "@/lib/auth";
import { getUserByEmail } from "@/lib/dal";
// Define Zod schema for signup validation
const SignUpSchema = z
  .object({
    username: z.string().min(1, "Full username is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validationResult = SignUpSchema.safeParse(body);
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

    const { username, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
          errors: {
            email: ["User with this email already exists"],
          },
        },
        { status: 409 }
      );
    }

    // Create new user
    const user = await createUser(username, email, password);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create user",
          error: "Failed to create user",
        },
        { status: 500 }
      );
    }

    // Create session for the newly registered user
    await createSession(user.id);
    console.log(user, "user created");

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while creating your account",
        error: "Failed to create account",
      },
      { status: 500 }
    );
  }
}
