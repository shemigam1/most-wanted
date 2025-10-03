"use client";

import * as React from "react";
import Link from "next/link";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/toggleDark";

export function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-lg border-b mb-5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">MOST WANTED</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <NavigationMenu className="md:block hidden">
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/#features"
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    Features
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/#how"
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    How It Works
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link
            href={"/login"}
            className="bg-red-600 hover:bg-red-700 p-3 rounded-lg"
          >
            Get Started
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
