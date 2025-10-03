"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, TrendingUp, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="bg-background">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="outline"
              className="mb-8 border-red-600/20 bg-red-600/10 text-red-500 hover:bg-red-600/10"
            >
              <Zap className="w-4 h-4 mr-2" />
              The Ultimate Bounty Platform
            </Badge>

            <h1 className="text-7xl font-bold mb-6 leading-tight">
              Put a <span className="text-red-600">Bounty</span> on
              <br />
              Anyone, Anywhere
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Create private rooms with friends, nominate targets, and watch the
              bounties stack up. Who will make it to the Most Wanted list?
            </p>

            <div className="flex items-center gap-4 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => router.push("/login")}
                className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-2xl shadow-red-600/20"
              >
                Start Hunting
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 blur-3xl"></div>
              <Card className="relative border shadow-2xl">
                <CardContent className="p-8">
                  <Card className="border">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                          <span className="text-xl">👑</span>
                        </div>
                        <h3 className="text-lg font-bold">Most Wanted</h3>
                      </div>
                      <div className="space-y-3">
                        {[
                          {
                            rank: 1,
                            name: "Sarah Johnson",
                            bounty: 247,
                            color: "bg-yellow-600",
                          },
                          {
                            rank: 2,
                            name: "Mike Chen",
                            bounty: 189,
                            color: "bg-gray-400",
                          },
                          {
                            rank: 3,
                            name: "Alex Rodriguez",
                            bounty: 156,
                            color: "bg-orange-600",
                          },
                        ].map((item) => (
                          <div
                            key={item.rank}
                            className="flex items-center gap-4 bg-muted/50 rounded-lg p-4"
                          >
                            <div
                              className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center font-bold text-black`}
                            >
                              {item.rank}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-semibold">{item.name}</div>
                            </div>
                            <div className="text-2xl font-bold text-red-500">
                              {item.bounty}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Why Most Wanted?</h2>
            <p className="text-xl text-muted-foreground">
              The most fun way to settle scores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border hover:border-red-600/50 transition">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-red-600/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Private Rooms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create exclusive rooms with codes. Keep your bounties between
                  friends, coworkers, or your gaming squad.
                </p>
              </CardContent>
            </Card>

            <Card className="border hover:border-red-600/50 transition">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-red-600/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Unlimited Targets</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nominate anyone you want. Stack bounties and watch as targets
                  climb the Most Wanted leaderboard.
                </p>
              </CardContent>
            </Card>

            <Card className="border hover:border-red-600/50 transition">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-red-600/10 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Live Leaderboards</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Watch rankings update in real-time. See who&apos;s climbing to
                  the top and who&apos;s safe... for now.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Create a Room</h3>
              <p className="text-muted-foreground">
                Start a private room and share the code with your crew. Easy
                setup in seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Nominate Targets</h3>
              <p className="text-muted-foreground">
                Add anyone to the bounty board. Friends, rivals, that guy who
                ate your lunch.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Place Bounties</h3>
              <p className="text-muted-foreground">
                Vote for who deserves to be Most Wanted. One vote per target,
                make it count.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-6">Ready to Start Hunting?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands creating bounties and settling scores
          </p>

          <div className="flex justify-center items-center gap-4 max-w-md mx-auto ">
            <Link
              href={"/signup"}
              className="rounded-lg bg-red-600 hover:bg-red-700 font-bold p-4 text-white"
            >
              Hunt your Opps now!
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
