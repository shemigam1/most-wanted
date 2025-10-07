import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/context/themeProvider";
import { Target } from "lucide-react";
// import { Toaster } from "react-hot-toast";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { RoomSkeleton } from "@/components/room-skeleton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Most Wanted",
  description: "An anonymous voting app to find the most wanted.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <Toaster />
          <Suspense fallback={<RoomSkeleton />}>{children}</Suspense>
          <footer className="py-12 px-6 border-t border-gray-800">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <span className="font-bold">MOST WANTED</span>
              </div>
              <div className="text-sm text-gray-500">
                © 2025 Most Wanted. All rights reserved.
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
