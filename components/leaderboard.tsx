"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface LeaderboardEntry {
  name: string;
  count: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  maxEntries?: number;
}

export function Leaderboard({ entries, maxEntries = 3 }: LeaderboardProps) {
  const topEntries = entries.slice(0, maxEntries);

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-400 text-yellow-900";
      case 1:
        return "bg-gray-300 text-gray-700";
      case 2:
        return "bg-orange-400 text-orange-900";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  if (!topEntries || topEntries.length === 0) {
    return (
      //   <div className="bg-background rounded-xl p-4 flex items-center gap-4 shadow-sm">
      <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            Most Wanted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>No one has taken the crown yet</div>
        </CardContent>
      </Card>
      //   </div>
    );
  }

  return (
    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600" />
          Most Wanted
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topEntries &&
            topEntries.map((entry, index) => (
              <div
                key={entry.name}
                className="bg-background rounded-xl p-4 flex items-center gap-4 shadow-sm"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${getRankColor(
                    index
                  )}`}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{entry.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.count}{" "}
                    {entry.count === 1 ? "nomination" : "nominations"}
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {entry.count}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
