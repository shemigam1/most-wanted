"use client";

import { Button } from "@/components/ui/button";
import { Users, Copy, LogOut, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
interface RoomHeaderProps {
  roomName: string;
  roomCode: string;
  memberCount: number;
  onExit: () => void;
}

export function RoomHeader({
  roomName,
  roomCode,
  memberCount,
  onExit,
}: RoomHeaderProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    toast("Share this code with others to invite them");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="border-b bg-card sticky top-17 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 mt-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{roomName}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {memberCount} members
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 hover:text-foreground transition"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Code: {roomCode}
                  </>
                )}
              </button>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onExit}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
