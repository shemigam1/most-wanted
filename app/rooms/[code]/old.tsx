"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Plus,
  Trophy,
  Target,
  Copy,
  LogOut,
  MoreVertical,
  Trash2,
  Check,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { RoomHeader } from "@/components/room-header";

// Mock data - replace with actual data fetching
const mockRoom = {
  id: "room-123",
  name: "Office Pranks",
  code: "ABC123",
  description: "Keep track of who deserves revenge in the office",
  memberCount: 8,
  createdBy: "user-1",
};

// Group nominations by person name to count how many times they've been nominated
const mockNominations = [
  {
    id: "1",
    name: "Sarah Johnson",
    offense: "Ate my lunch from the office fridge... AGAIN",
    userId: "user-1",
  },
  {
    id: "2",
    name: "Mike Chen",
    offense: "Never mutes on Zoom calls",
    userId: "user-2",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    offense: "Takes the last coffee and doesn't make more",
    userId: "user-3",
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    offense: "Always AFKs in ranked games",
    userId: "user-4",
  },
  {
    id: "5",
    name: "Mike Chen",
    offense: "Eats smelly food at desk",
    userId: "user-1",
  },
  {
    id: "6",
    name: "Sarah Johnson",
    offense: "Plays music without headphones",
    userId: "user-4",
  },
  {
    id: "7",
    name: "Emma Davis",
    offense: "Spoiled the ending of my favorite show",
    userId: "user-2",
  },
];

const currentUserId = "user-1"; // Replace with actual user ID from session

export default function RoomView() {
  const router = useRouter();
  //   const { toast } = useToast();
  const [nominations, setNominations] = useState(mockNominations);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nominationToDelete, setNominationToDelete] = useState<string | null>(
    null
  );
  const [copiedCode, setCopiedCode] = useState(false);

  // Group nominations by name and count
  const targetCounts = nominations.reduce((acc, nom) => {
    if (!acc[nom.name]) {
      acc[nom.name] = { name: nom.name, count: 0, nominations: [] };
    }
    acc[nom.name].count++;
    acc[nom.name].nominations.push(nom);
    return acc;
  }, {} as Record<string, { name: string; count: number; nominations: typeof mockNominations }>);

  const leaderboard = Object.values(targetCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(mockRoom.code);
    setCopiedCode(true);
    toast("Share this code with others to invite them");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDeleteNomination = async () => {
    if (!nominationToDelete) return;

    setNominations((prev) => prev.filter((n) => n.id !== nominationToDelete));
    setDeleteDialogOpen(false);
    setNominationToDelete(null);

    // TODO: Call delete API
    toast("Your nomination has been deleted from the room");
  };

  const canDeleteNomination = (nomination: (typeof mockNominations)[0]) => {
    return nomination.userId === currentUserId;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card sticky top-0 z-10 w-full ">
        <RoomHeader
          roomName={""}
          roomCode={""}
          memberCount={0}
          onExit={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{mockRoom.name}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {mockRoom.memberCount} members
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
                      Code: {mockRoom.code}
                    </>
                  )}
                </button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/rooms")}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Leaderboard */}
        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Most Wanted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.slice(0, 3).map((target, index) => (
                <div
                  key={target.name}
                  className="bg-background rounded-xl p-4 flex items-center gap-4 shadow-sm"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0
                        ? "bg-yellow-400 text-yellow-900"
                        : index === 1
                        ? "bg-gray-300 text-gray-700"
                        : "bg-orange-400 text-orange-900"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{target.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {target.count}{" "}
                      {target.count === 1 ? "nomination" : "nominations"}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {target.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nominate Button */}
        <Button
          onClick={() => router.push(`/rooms/${mockRoom.id}/nominate`)}
          className="w-full bg-purple-600 hover:bg-purple-700 py-6"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nominate Someone
        </Button>

        {/* All Targets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              All Nominations ({nominations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nominations.map((nomination) => (
                <div
                  key={nomination.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:border-purple-300 transition"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-semibold">{nomination.name}</div>
                      <Badge variant="secondary" className="text-xs">
                        {targetCounts[nomination.name]?.count || 1} total
                      </Badge>
                    </div>
                    {nomination.offense && (
                      <div className="text-sm text-muted-foreground">
                        {nomination.offense}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {canDeleteNomination(nomination) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setNominationToDelete(nomination.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}

              {nominations.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No nominations yet</p>
                  <p className="text-sm">
                    Be the first to nominate someone for a bounty
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete nomination?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove your nomination from the room. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNomination}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
