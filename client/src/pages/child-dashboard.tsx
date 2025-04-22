// client/src/pages/child-dashboard.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { ScreenTimeData } from "@/types/screenTime";
import type { UserLessonProgress } from "@/types/lesson";
import ChildLayout from "@/components/layout/child-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import {
  BookOpen,
  BookText,
  Bookmark,
  Clock,
  Check,
  Lock,
  Trophy,
  Medal,
  Star,
} from "lucide-react";
import { fetchChildDashboardData } from "@/api/childDashboard";

interface DashboardData {
  screenTime: ScreenTimeData | null;
  lessonProgress: UserLessonProgress[];
}

export default function ChildDashboard() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery<DashboardData, Error>({
    queryKey: ["childDashboardData"],
    queryFn: fetchChildDashboardData,
  });

  const screenTime = data?.screenTime;
  const lessonProgress = data?.lessonProgress ?? [];

  // Screen time usage breakdown
  const usedMinutes = screenTime?.usageToday.total ?? 0;
  const allowedMinutes = screenTime?.dailyLimits.total ?? 0;
  const screenTimePercentage =
    allowedMinutes > 0
      ? Math.round((usedMinutes / allowedMinutes) * 100)
      : 0;

  // Lessons completed
  const completedLessons = lessonProgress.filter((l) => l.completed).length;
  const totalLessons = lessonProgress.length || 5;

  // % for Bible challenge
  const lessonsPercentage =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  return (
    <ChildLayout title="My Home">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-700 dark:text-primary-300 mb-2">
              Welcome back, {user?.display_name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Ready for a wonderful day with Jesus?
            </p>

            <div className="flex items-center space-x-3 mb-4">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Daily Bible Challenge
                </div>
                <div className="mt-1 flex items-center">
                  <Progress value={lessonsPercentage} className="h-3 w-full" />
                  <span className="ml-2 text-sm font-medium text-accent-600 dark:text-accent-400">
                    {completedLessons}/{totalLessons}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="py-3 px-5 rounded-full">
                <Link href="/bible">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Bible
                </Link>
              </Button>
              <Button asChild className="py-3 px-5 rounded-full" variant="secondary">
                <Link href="/lessons">
                  <BookText className="mr-2 h-4 w-4" />
                  Continue Lessons
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80"
              alt="Child reading Bible"
              className="h-48 w-48 object-cover rounded-full border-4 border-white shadow-md dark:border-gray-700 animate-[float_3s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Screen Time */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Clock className="h-6 w-6 text-primary-500 mr-2" />
                Today's Screen Time
              </h2>
              <span className="text-accent-500 dark:text-accent-400 font-medium">
                {screenTime
                  ? `${screenTime.usageToday.total}m of ${screenTime.dailyLimits.total}m`
                  : "Loading..."}
              </span>
            </div>
            <Progress value={screenTimePercentage} className="h-4 mb-4" />
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete your Bible lessons to earn more screen time!
              </p>
              <Button className="mt-3 font-medium" variant="outline" asChild>
                <Link href="/lessons">View Bible Lessons</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Verse of the Day */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <Bookmark className="h-6 w-6 text-accent-500 mr-2" />
              Today's Verse
            </h2>
            <div className="mb-4 p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200 font-serif italic mb-2">
                "For God so loved the world that he gave his one and only Son, that whoever believes in
                him shall not perish but have eternal life."
              </p>
              <p className="text-right text-sm font-medium text-accent-700 dark:text-accent-400">
                John 3:16 (NIrV)
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Try to memorize this verse today!
              </p>
              <Button className="font-medium" variant="outline">
                Practice Memory Verse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* … you can continue with the Lessons & Rewards sections below in the same style … */}
    </ChildLayout>
  );
}
