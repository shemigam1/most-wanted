"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RoomHeader } from "@/components/room-header";
import { Leaderboard } from "@/components/leaderboard";
import { NominationsList } from "@/components/nominations-list";
import { DeleteNominationDialog } from "@/components/delete-nomination-dialogue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateHit from "@/components/create-hit";
import { Nomination } from "@/lib/types";
// import { fetchRoomData, RoomDataDub } from "@/app/actions/rooms";
// import { deleteHit } from "@/app/actions/hit";
// import { signOut } from "@/app/actions/auth";
import { ApiResponse } from "@/lib/api";
import { deleteHit, getHitsByRoom, signOut } from "@/lib/api-client";

export interface RoomDataDub {
  id: string;
  name: string;
  description?: string | null;
  code?: string;
}

interface RoomClientComponentProps {
  roomData: ApiResponse<RoomDataDub>;
  hitsData: ApiResponse<Nomination[]>;
  code: string;
  userId: string;
}

export default function RoomClientComponent({
  roomData,
  hitsData,
  code,
  userId,
}: // userId,
RoomClientComponentProps) {
  // console.log(roomData, "room data");

  const router = useRouter();
  // if (!userId) {
  //   router.push("/login");
  // }
  const [nominations, setNominations] = useState<Nomination[]>(
    hitsData?.data || []
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nominationToDelete, setNominationToDelete] = useState<string | null>(
    null
  );
  const [roomName, setRoomName] = useState<string>(
    roomData?.data?.name || "Justice League"
  );
  const [roomId, setRoomId] = useState<string>(roomData?.data?.id || "");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const refetchData = async () => {
      try {
        // You can add client-side refetching logic here if needed
        // This runs after the initial server-rendered data
      } catch (error) {
        console.error("Error refetching data:", error);
      }
    };
    refetchData();
  }, [code]);

  const targetCounts =
    nominations && nominations.length > 0
      ? nominations.reduce((acc, nom) => {
          if (nom.name) {
            if (!acc[nom.name]) {
              acc[nom.name] = { name: nom.name, count: 0 };
            }
            acc[nom.name].count++;
          }
          return acc;
        }, {} as Record<string, { name: string; count: number }>)
      : {};

  const leaderboard = Object.values(targetCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const handleDeleteClick = (id: string) => {
    setNominationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!nominationToDelete) return;

    setNominations(
      (prev) => prev?.filter((n) => n.id !== nominationToDelete) ?? []
    );
    setDeleteDialogOpen(false);
    const res = await deleteHit(nominationToDelete);
    setNominationToDelete(null);

    toast("Your nomination has been deleted from the room");
  };

  const handleSubmit = async () => {
    setOpen(false);
    // const newData = await fetchRoomData(code, roomId);
    const newData = await getHitsByRoom(roomId);
    const hits = newData?.data;
    // console.log(hits, "hits fom submit");
    // console.log(typeof hits);

    setNominations(hits ?? []);
    // console.log(newData, "newdata");
  };

  return (
    <div className="min-h-screen bg-background mt-20">
      <RoomHeader
        roomName={roomName}
        roomCode={code}
        memberCount={9}
        onExit={async () => {
          await signOut();
          router.push("/");
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <Leaderboard entries={leaderboard} maxEntries={3} />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl">
            <Plus className="w-5 h-5 mr-2" />
            Nominate Your Opps
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Once you put a Hit out, there is no going back
              </DialogTitle>
              <CreateHit onFormSubmit={handleSubmit} roomId={roomId} />
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <NominationsList
          nominations={nominations}
          currentUserId={userId}
          targetCounts={targetCounts}
          onDelete={handleDeleteClick}
        />
      </div>

      <DeleteNominationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
