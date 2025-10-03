"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
// import { NominationCard } from "./nomination-card";
import { NominationCard } from "./nomination-card";
import { Nomination } from "@/lib/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface NominationsListProps {
  nominations: Nomination[];
  currentUserId: string;
  targetCounts: Record<string, { count: number }>;
  onDelete: (id: string) => void;
}

export function NominationsList({
  nominations,
  currentUserId,
  targetCounts,
  onDelete,
}: NominationsListProps) {
  return (
    <ScrollArea>
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
              <NominationCard
                key={nomination.id}
                id={nomination.id}
                name={nomination.name}
                offense={nomination.offense}
                totalCount={targetCounts[nomination.name]?.count || 1}
                canDelete={nomination.userId === currentUserId}
                onDelete={onDelete}
              />
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
    </ScrollArea>
  );
}
