import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchChildDashboardData } from "@/api/childDashboard";
import { useAuth } from "@/hooks/use-auth";
import ChildLayout from "@/components/layout/child-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { BookOpen, BookText, Bookmark, Clock, Check, Lock } from "lucide-react";
import CastleLogo from "@/components/ui/castle";

export default function ChildDashboard() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["childDashboardData"],
    queryFn: fetchChildDashboardData,
  });

  const screenTime = data?.screenTime;
  const lessonProgress = data?.lessonProgress ?? [];

  const usedMinutes = screenTime?.usageToday.total ?? 0;
  const allowedMinutes = screenTime?.dailyLimits.total ?? 0;
  const screenTimePercentage = allowedMinutes > 0 ? Math.round((usedMinutes / allowedMinutes) * 100) : 0;

  const completedLessons = lessonProgress.filter((l) => l.completed).length;
  const totalLessons = lessonProgress.length || 1;
  const lessonsPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <ChildLayout title="My Home">
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12">
            <CastleLogo />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-primary-700 dark:text-primary-300">
          Welcome back, {user?.display_name}!
        </h1>
        <p className="mb-4 text-gray-600 dark:text-gray-300">Ready for a wonderful day with Jesus?</p>
        <Progress value={lessonsPercentage} className="h-3 w-full mb-2" />
        <p className="text-sm text-accent-600 dark:text-accent-400">
          {completedLessons}/{totalLessons} Lessons Completed
        </p>
        <div className="flex gap-3 mt-4">
          <Button asChild className="py-2 px-4">
            <Link href="/bible">
              <BookOpen className="mr-2 h-4 w-4" />
              Read Bible
            </Link>
          </Button>
          <Button asChild variant="secondary" className="py-2 px-4">
            <Link href="/lessons">
              <BookText className="mr-2 h-4 w-4" />
              Continue Lessons
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
            <Clock className="h-6 w-6 text-primary-500 mr-2" />
            Today's Screen Time
          </h2>
          <Progress value={screenTimePercentage} className="h-4 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {usedMinutes}m of {allowedMinutes}m used
          </p>
        </CardContent>
      </Card>
    </ChildLayout>
  );
}
