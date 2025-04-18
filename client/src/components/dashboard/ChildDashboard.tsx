import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { ScriptureProgress } from "@/types/scripture";
import { BibleLesson } from "@/types/lesson";
import {
  GraduationCap,
  Award,
  Star,
  Book,
  Clock,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChildDashboardProps {
  childId?: number;
}

type ChildDashboardData = {
  user: User;
  scriptureProgress: ScriptureProgress[];
  recentLessons: BibleLesson[];
  dailyDevotional: {
    title: string;
    verse: string;
    content: string;
  };
  gameTime: {
    earned: number;
    available: number;
    total: number;
  };
};

const ChildDashboard: React.FC<ChildDashboardProps> = ({ childId }) => {
  const { data } = useQuery<ChildDashboardData>({
    queryKey: ["/api/dashboard/child", childId],
  });

  const isLoading = !data;
  const devotional = data?.dailyDevotional;
  const gameTime = data?.gameTime;
  const scriptureProgress = data?.scriptureProgress || [];

  return (
    <div className="space-y-6 px-4 py-6 animate-fade-in">
      {/* 🎉 Welcome Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-1 text-gradient bg-gradient-to-r from-cyan-400 to-blue-500 inline-block bg-clip-text text-transparent">
          👋 Welcome, {isLoading ? <Skeleton className="h-6 w-32 inline-block" /> : data?.user.displayName || "Friend"}!
        </h2>
        <p className="text-muted-foreground text-lg">Let’s grow in God’s Word together today!</p>
      </div>

      {/* 📖 Daily Devotional */}
      <section>
        <Card className="shadow-lg border border-blue-300/20 bg-blue-50 dark:bg-muted/70">
          <CardContent className="p-5">
            <div className="flex items-center mb-3 gap-2">
              <Sparkles className="text-yellow-500 animate-pulse" />
              <h3 className="font-bold text-xl">Today's Devotional</h3>
            </div>

            {isLoading || !devotional ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              <>
                <h4 className="text-lg font-semibold text-primary">{devotional.title}</h4>
                <p className="text-sm italic font-serif text-sky-600 dark:text-sky-400 mb-2">
                  “{devotional.verse}”
                </p>
                <p className="text-sm text-muted-foreground">{devotional.content}</p>
                <div className="mt-4 text-right">
                  <Link href="/devotionals/today">
                    <Button size="sm">Open Full Devotional</Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 🕹️ Game Time */}
      <section>
        <Card className="shadow-md border border-green-300/20 bg-green-50 dark:bg-muted/70">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold flex items-center gap-1">
                <Clock className="h-5 w-5 text-primary" />
                Game Time
              </h3>
              {isLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <span className="text-primary text-sm font-bold">{gameTime?.available ?? 0} mins left</span>
              )}
            </div>

            <div className="bg-muted/20 rounded-xl p-3 mb-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="text-primary font-medium">
                  {isLoading ? "..." : `${gameTime?.earned ?? 0}/${gameTime?.total ?? 0} mins`}
                </span>
              </div>
              <div className="w-full bg-muted/40 rounded-full h-2 mt-1">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{
                    width: isLoading || !gameTime?.total
                      ? "0%"
                      : `${(gameTime.earned / gameTime.total) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Earn game time by completing Bible challenges! 🏆
              </p>
            </div>

            <div className="flex justify-between gap-2">
              <Link href="/lessons">
                <Button variant="outline" size="sm" className="w-full">
                  <GraduationCap className="mr-1 h-4 w-4" />
                  Lessons
                </Button>
              </Link>
              <Link href="/bible/memorize">
                <Button variant="outline" size="sm" className="w-full">
                  <Star className="mr-1 h-4 w-4" />
                  Memory Verses
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 📖 Scripture Memorization */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-sky-500">Your Scripture Memory</h3>
          <Link href="/bible/memorize">
            <Button variant="link" className="text-primary">See All</Button>
          </Link>
        </div>

        <Card className="shadow-md border border-yellow-300/20 bg-yellow-50 dark:bg-muted/70">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-60" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            ) : scriptureProgress.length > 0 ? (
              <div className="space-y-4">
                {scriptureProgress.slice(0, 3).map((scripture) => (
                  <div key={scripture.id} className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-md text-primary">{scripture.scriptureReference}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {scripture.content}
                      </p>
                    </div>
                    <Link href={`/bible/memorize/${scripture.id}`}>
                      <Button
                        size="sm"
                        variant={scripture.memorized ? "outline" : "default"}
                        className={scripture.memorized ? "text-green-500" : ""}
                      >
                        {scripture.memorized ? (
                          <>
                            <Award className="mr-1 h-4 w-4" />
                            Done!
                          </>
                        ) : (
                          "Practice"
                        )}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No scriptures yet! Start one now ✨</p>
                <Link href="/bible/memorize/new">
                  <Button className="mt-2">Start Memorizing</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ChildDashboard;
