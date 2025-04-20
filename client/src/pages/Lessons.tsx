import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface BibleLesson {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: string;
  ageRange: string;
  scriptureReferences: string;
}

interface UserLessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

const Lessons: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<BibleLesson | null>(null);

  const { data: lessons, isLoading: lessonsLoading } = useQuery<BibleLesson[]>({
    queryKey: ["/api/bible-lessons"],
  });

  const { data: progress, isLoading: progressLoading } = useQuery<UserLessonProgress[]>({
    queryKey: ["/api/user-lesson-progress"],
  });

  const getUserProgress = (lessonId: string) => {
    return progress?.find((p) => p.lessonId === lessonId);
  };

  return (
    <div className="relative overflow-hidden w-full min-h-screen">
      <div
        className="absolute  mb-0 pb-0 inset-0 bg-cover bg-center opacity-90 dark:opacity-50"
        style={{ backgroundImage: "url('/images/lessonbg.png')" }}
      />
      <div className="absolute inset-0 bg-white/60 dark:bg-black/60  z-0" />

      <div className="relative z-10 px-4 pt-10 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-cyan-600 drop-shadow-lg mb-2">Bible Lessons</h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Learn about God's Word through interactive lessons
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card className="bg-cyan-100/80 dark:bg-cyan-900/30 border border-cyan-200 rounded-xl shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-block p-3 bg-cyan-200 dark:bg-cyan-800 rounded-full mb-4">
                  <GraduationCap className="h-8 w-8 text-cyan-600" />
                </div>
                <h2 className="text-xl font-bold mb-1">Your Progress</h2>
                <p className="text-muted-foreground mb-4">Keep learning to earn rewards!</p>

                {progressLoading ? (
                  <Skeleton className="h-4 w-full mb-2" />
                ) : (
                  <>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span>Completed</span>
                      <span>
                        {progress?.filter((p) => p.completed).length || 0}/{lessons?.length || 0} lessons
                      </span>
                    </div>
                    <Progress
                      value={progress && lessons ?
                        (progress.filter((p) => p.completed).length / lessons.length) * 100 : 0}
                      className="mb-6"
                    />
                  </>
                )}

                <div className="space-y-2 text-left">
                  <h3 className="font-medium text-sm">Game Time Earned:</h3>
                  <div className="flex items-center">
                    <span className="font-bold text-cyan-700 dark:text-cyan-300">
                      {progress ? progress.filter((p) => p.completed).length * 5 : 0} minutes
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {lessonsLoading ? (
            Array(3).fill(null).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                </CardContent>
              </Card>
            ))
          ) : lessons && lessons.length > 0 ? (
            lessons.map((lesson) => {
              const userProgress = getUserProgress(lesson.id);
              return (
                <Card
                  key={lesson.id}
                  className={`transition transform hover:scale-[1.02] bg-white/90 dark:bg-black/30 border shadow-md hover:shadow-xl rounded-xl cursor-pointer ${
                    userProgress?.completed ? "border-green-500" : "border-cyan-100"
                  }`}
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="inline-block p-3 bg-muted/20 rounded-full mb-3">
                      {userProgress?.completed ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : (
                        <GraduationCap className="h-8 w-8 text-cyan-600" />
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {lesson.content.split("\n")[0]}
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                      <Badge variant="outline">{lesson.ageRange}</Badge>
                      <Badge variant="outline">{lesson.scriptureReferences}</Badge>
                    </div>

                    <Button
                      variant={userProgress?.completed ? "outline" : "default"}
                      size="sm"
                      className={userProgress?.completed ? "text-green-500" : ""}
                    >
                      {userProgress?.completed ? (
                        <>
                          <CheckCircle className="mr-1 h-4 w-4" /> Completed
                        </>
                      ) : (
                        "Start Lesson"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No lessons available</h3>
                <p className="text-muted-foreground">Check back soon for new Bible lessons!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lessons;
