"use client";

import * as React from "react";
import { AlertCircle, Home, ArrowLeft, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorPageProps {
  title?: string;
  message?: string;
  errorCode?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  onHome?: () => void;
}

export default function ErrorPage({
  title = "Something Went Wrong",
  message = "We encountered an unexpected error. Don't worry, your data is safe.",
  errorCode = "404",
  showBackButton = true,
  onBack,
  onHome,
}: ErrorPageProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950/20 to-gray-950 flex items-center justify-center p-6 mt-20">
      <Card className="w-full max-w-2xl border-red-900/20 shadow-2xl shadow-red-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />

        <CardHeader className="space-y-4 pb-6 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 mx-auto bg-red-600/10 rounded-2xl border-2 border-red-600/20">
            <span className="text-3xl font-bold text-red-600">{errorCode}</span>
          </div>

          {/* Icon and Title */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <CardTitle className="text-3xl font-bold">{title}</CardTitle>
            </div>
            <CardDescription className="text-base max-w-md mx-auto">
              {message}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          {/* Decorative divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <Target className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              If you continue to experience issues, please try refreshing the
              page or contact support.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 relative">
          {showBackButton && (
            <Button
              variant="outline"
              className="flex-1 h-12"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          )}
          <Button
            className="flex-1 h-12 bg-red-600 hover:bg-red-700"
            onClick={handleHome}
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
