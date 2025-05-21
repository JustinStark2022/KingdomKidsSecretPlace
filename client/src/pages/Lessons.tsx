import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import ParentLayout from "@/components/layout/parent-layout";
import ChildLayout from "@/components/layout/child-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, Lock, BookOpen, Gift, Trophy, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types
interface Lesson {
  id: number;
  title: string;
  verseRef: string;
  content: string;
  rewardAmount: number;
}

interface LessonProgress {
  lesson: Lesson;
  completed: boolean;
}

interface Child {
  id: number;
  first_name: string;
  last_name: string;
}

export default function Lessons() {
  const { user } = useAuth();
  const isChild = user?.role === "child";
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("available");
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [assigningLessonId, setAssigningLessonId] = useState<number | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  const { data: lessonProgress = [], isLoading } = useQuery<LessonProgress[]>({
  queryKey: ["/api/lessons", selectedChildId],
  queryFn: async () => {
    const url = isChild
      ? "/api/lessons"
      : `/api/lessons?childId=${selectedChildId}`;
    const res = await apiRequest("GET", url);
    return res.json();
  },
  enabled: isChild || (!!selectedChildId && !isChild),
});


  const completeLessonMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      const res = await apiRequest("POST", `/api/lessons/${lessonId}/complete`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/screentime"] });
      toast({
        title: "Lesson completed!",
        description: "You've earned extra screen time as a reward.",
      });
      setSelectedLesson(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error completing lesson",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const assignLessonMutation = useMutation({
    mutationFn: async ({ lessonId, childId }: { lessonId: number; childId: number }) => {
      const res = await apiRequest("POST", `/api/lessons/${lessonId}/assign`, { childId });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Lesson assigned!", description: "The lesson was assigned to the child." });
      setAssigningLessonId(null);
      setSelectedChildId(null);
    },
    onError: (error: any) => {
      toast({ title: "Error assigning lesson", description: error.message, variant: "destructive" });
    },
  });

  const { data: children = [], isLoading: isChildrenLoading } = useQuery<Child[]>({
    queryKey: ["/api/children"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/children");
      return res.json();
    },
    enabled: !isChild,
  });

  const completedLessons = lessonProgress.filter(item => item.completed).length;
  const totalLessons = lessonProgress.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const filteredLessons = lessonProgress.filter((item) => {
    if (activeTab === "available") return !item.completed;
    if (activeTab === "completed") return item.completed;
    return true;
  });

  const handleCompleteLesson = (lessonId: number) => {
    completeLessonMutation.mutate(lessonId);
  };

  const Layout = isChild ? ChildLayout : ParentLayout;

  useEffect(() => {
    if (!isChild && children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children, isChild, selectedChildId]);

  return (
    <Layout title="Bible Lessons">
      <div className="max-w-5xl mx-auto">

        {/* Move the child selection dropdown here, above the lessons grid */}
        {!isChild && (
          <div className="mb-6 flex items-center gap-2">
            <label className="font-medium">Viewing:</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedChildId ?? ""}
              onChange={e => setSelectedChildId(Number(e.target.value))}
              disabled={isChildrenLoading}
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.first_name} {child.last_name}
                </option>
              ))}
            </select>
          </div>
        )}

        <Card className="mb-6 border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-primary-700 dark:text-primary-300 flex items-center">
                  <BookOpen className="mr-2 h-6 w-6" />
                  Bible Lessons
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {isChild
                    ? "Complete lessons to earn rewards and learn more about God's Word"
                    : "Track your child's progress through Biblical lessons"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Lessons Completed</div>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {completedLessons}/{totalLessons}
                  </div>
                </div>
                <div className="bg-accent-100 dark:bg-accent-900/30 rounded-full p-3">
                  <Trophy className="h-8 w-8 text-accent-600 dark:text-accent-400" />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />

              {isChild && completedLessons > 0 && (
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
                  You've earned a total of <span className="font-medium text-green-600 dark:text-green-400">
                    {completedLessons * 15} minutes
                  </span> of extra screen time!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="available">Available</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="all">All Lessons</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-10 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Loading lessons...</p>
                  </div>
                ) : filteredLessons.length === 0 ? (
                  <div className="py-10 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {activeTab === "available"
                        ? "All lessons completed!"
                        : activeTab === "completed"
                          ? "No lessons completed yet"
                          : "No lessons available"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activeTab === "available"
                        ? "Great job! You've completed all available lessons."
                        : activeTab === "completed"
                          ? "Complete a lesson to see it listed here"
                          : "Check back later for new lessons"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLessons.map((item) => (
                      <div
                        key={item.lesson.id}
                        className={`p-4 rounded-lg border ${
                          selectedLesson === item.lesson.id
                            ? "border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        } transition-colors cursor-pointer`}
                        onClick={() => setSelectedLesson(selectedLesson === item.lesson.id ? null : item.lesson.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full ${
                              item.completed
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
                            } flex items-center justify-center mr-3`}>
                              {item.completed ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <BookOpen className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                {item.lesson.title}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.lesson.verseRef}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            {item.completed ? (
                              <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                +{item.lesson.rewardAmount}m Reward
                              </Badge>
                            )}
                          </div>
                        </div>

                        {selectedLesson === item.lesson.id && (
                          <div className="mt-4 border-t pt-4">
                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                              {item.lesson.content}
                            </p>
                            <div className="flex justify-end">
                              {!item.completed && isChild && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompleteLesson(item.lesson.id);
                                  }}
                                  disabled={completeLessonMutation.isPending}
                                >
                                  {completeLessonMutation.isPending ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Completing...
                                    </>
                                  ) : (
                                    "Mark as Completed"
                                  )}
                                </Button>
                              )}
                              {!isChild && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAssigningLessonId(item.lesson.id);
                                  }}
                                >
                                  Assign
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (Rewards and Badges) */}
          <div>
            {/* Rewards Card */}
            <Card className="border-0 shadow-md mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-accent-500" />
                  Rewards
                </CardTitle>
                <CardDescription>
                  Complete lessons to earn screen time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* rewards summary */}
              </CardContent>
            </Card>

            {/* Badges Earned */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary-500" />
                  Your Badges
                </CardTitle>
                <CardDescription>
                  Achievements you've earned
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* badges display */}
              </CardContent>
            </Card>
          </div>
        </div>

        {assigningLessonId && (
          <div className="mt-4 p-4 bg-gray-50 rounded shadow">
            <label className="block mb-2 font-medium">Assign to Child:</label>
            {isChildrenLoading ? (
              <div className="text-sm text-gray-500">Loading children...</div>
            ) : (
              <select
                className="border rounded px-2 py-1"
                value={selectedChildId ?? ""}
                onChange={e => setSelectedChildId(Number(e.target.value))}
              >
                <option value="">Select a child</option>
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.first_name} {child.last_name}
                  </option>
                ))}
              </select>
            )}
            <Button
              className="ml-2"
              disabled={!selectedChildId || assignLessonMutation.isPending}
              onClick={() =>
                assignLessonMutation.mutate({
                  lessonId: assigningLessonId,
                  childId: selectedChildId!,
                })
              }
            >
              Assign
            </Button>
            <Button variant="ghost" className="ml-2" onClick={() => setAssigningLessonId(null)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
