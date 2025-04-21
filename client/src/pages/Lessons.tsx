import { useState } from "react";
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

export default function Lessons() {
  const { user } = useAuth();
  const isChild = user?.role === "child";
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("available");
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  // Fetch lessons and progress
  const { data: lessonProgress, isLoading } = useQuery({
    queryKey: ["/api/lessons/progress"],
  });

  // Complete lesson mutation
  const completeLessonMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      const res = await apiRequest("POST", `/api/lessons/${lessonId}/complete`);
      return await res.json();
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
    onError: (error) => {
      toast({
        title: "Error completing lesson",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate progress
  const completedLessons = lessonProgress 
    ? lessonProgress.filter(item => item.completed).length 
    : 0;
  
  const totalLessons = lessonProgress ? lessonProgress.length : 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Filter lessons based on active tab
  const filteredLessons = lessonProgress
    ? activeTab === "available" 
      ? lessonProgress.filter(item => !item.completed)
      : activeTab === "completed"
        ? lessonProgress.filter(item => item.completed)
        : lessonProgress
    : [];

  // Handle lesson completion
  const handleCompleteLesson = (lessonId: number) => {
    completeLessonMutation.mutate(lessonId);
  };

  const Layout = isChild ? ChildLayout : ParentLayout;

  return (
    <Layout title="Bible Lessons">
      <div className="max-w-5xl mx-auto">
        {/* Progress Overview */}
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

        {/* Lesson Tabs & List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lessons List */}
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
                    {filteredLessons.map((item, index) => (
                      <div 
                        key={item.lesson.id} 
                        className={`p-4 rounded-lg border ${
                          selectedLesson === item.lesson.id
                            ? "border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        } transition-colors cursor-pointer`}
                        onClick={() => setSelectedLesson(
                          selectedLesson === item.lesson.id ? null : item.lesson.id
                        )}
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
                                    <>
                                      Mark as Completed
                                    </>
                                  )}
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

          {/* Sidebar with rewards/info */}
          <div>
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
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                    <span className="font-medium text-sm">Each Lesson</span>
                    <Badge variant="outline" className="bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-300 border-accent-200 dark:border-accent-800">
                      +15 min Screen Time
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                    <span className="font-medium text-sm">5 Lessons</span>
                    <Badge variant="outline" className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 border-primary-200 dark:border-primary-800">
                      Bible Explorer Badge
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-secondary-50 dark:bg-secondary-900/20">
                    <span className="font-medium text-sm">All Lessons</span>
                    <Badge variant="outline" className="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300 border-secondary-200 dark:border-secondary-800">
                      Scripture Champion
                    </Badge>
                  </div>
                </div>
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
                {completedLessons >= 3 ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 text-center bg-accent-50 dark:bg-accent-900/20 rounded-lg">
                      <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-accent-100 dark:bg-accent-900/50 text-accent-600 dark:text-accent-400 mb-2">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-medium">Bible Reader</div>
                    </div>
                    
                    {completedLessons >= 5 && (
                      <div className="p-3 text-center bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 mb-2">
                          <Award className="h-5 w-5" />
                        </div>
                        <div className="text-sm font-medium">Bible Explorer</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Lock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Complete at least 3 lessons to earn your first badge!
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center w-full">
                  {totalLessons - completedLessons > 0 
                    ? `Complete ${totalLessons - completedLessons} more lesson${totalLessons - completedLessons !== 1 ? 's' : ''} to earn all badges!` 
                    : "Congratulations! You've earned all available badges!"}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
