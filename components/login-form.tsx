"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginFormData, validateLoginForm } from "../lib/validation";
import { PasswordInput } from "./ui/password-input";
// import { useForm } from "react-hook-form";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/actions/auth";

const loginFormResolver = (data: LoginFormData) => {
  const validationErrors = validateLoginForm(data);

  if (validationErrors.length === 0) {
    return {
      values: data,
      errors: {},
    };
  }

  // Convert your validation errors to React Hook Form format
  const errors: Record<string, { type: string; message: string }> = {};

  validationErrors.forEach((error) => {
    if (error.field) {
      errors[error.field] = {
        type: "manual",
        message: error.message,
      };
    }
  });

  return {
    values: {},
    errors,
  };
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    defaultValues: {
      // username: "",
      email: "",
      password: "",
      // confirmPassword: "",
    },
    resolver: loginFormResolver,
    mode: "onTouched",
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearErrors("root");
      const formData: FormData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await signIn(formData);
      if (response.success) {
        console.log(data, "login data");

        console.log("user login success");
        router.push("/rooms");
      } else {
        setError("root", {
          type: "manual",
          message: "Login failed. Please try again.",
        });
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Log in to your account</h1>
        {/* <p className="text-muted-foreground text-sm text-balance">
          Enter your information below to create your account
        </p> */}
      </div>

      {errors.root && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {errors.root.message}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="johnwick@example.com"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
