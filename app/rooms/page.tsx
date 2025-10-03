"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { getCurrentUser } from "@/lib/dal";

export default function Rooms() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();
  //   await getCurrentUser();

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      router.push(`/rooms/${roomCode}`);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md space-y-4">
        <Button
          onClick={() => router.push("/rooms/create")}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 rounded-xl shadow-lg"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-3" />
          Create New Room
        </Button>

        <div className="relative">
          <Separator className="my-4" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground">
              or
            </span>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-code" className="text-sm font-medium">
                  Join with Room Code
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="room-code"
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1"
                    maxLength={6}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleJoinRoom();
                      }
                    }}
                  />
                  <Button
                    onClick={handleJoinRoom}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!roomCode.trim()}
                  >
                    Join
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
