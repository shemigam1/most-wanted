"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface NominationCardProps {
  id: string;
  name: string;
  offense?: string | null;
  totalCount: number;
  canDelete: boolean;
  onDelete: (id: string) => void;
}

export function NominationCard({
  id,
  name,
  offense,
  totalCount,
  canDelete,
  onDelete,
}: NominationCardProps) {
  return (
    <div className="flex items-center justify-between p-2 border rounded-xl hover:border-purple-300 transition">
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2 mb-1">
          <Dialog>
            <DialogTrigger className="flex items-center gap-2 cursor-grabbing border p-3 hover:border-red-600 rounded-lg">
              <div className="font-semibold">{name}</div>
              <Badge variant="secondary" className="text-xs">
                {totalCount} total
              </Badge>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <div className="text-sm text-muted-foreground">{offense}</div>
                </DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        {/* {offense && (
          <div className="text-sm text-muted-foreground">{offense}</div>
        )} */}
      </div>
      <div className="flex items-center gap-2">
        {canDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
