import { useQuery } from "@tanstack/react-query";
import ChildLayout from "@/components/layout/child-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { 
  BookOpen, 
  BookText, 
  Star, 
  Medal, 
  Trophy, 
  Check, 
  Lock, 
  Book,
  Clock,
  Bookmark
} from "lucide-react";

export default function ChildDashboard() {
  const { user } = useAuth();

  // Fetch screen time
  const { data: screenTime, isLoading: screenTimeLoading } = useQuery({
    queryKey: ["/api/screentime"],
  });

  // Fetch lessons progress
  const { data: lessonProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/lessons/progress"],
  });

  // Calculate progress percentages
  const screenTimePercentage = screenTime 
    ? Math.round((screenTime.usedTimeMinutes / screenTime.allowedTimeMinutes) * 100)
    : 0;
  
  const completedLessons = lessonProgress
    ? lessonProgress.filter(item => item.completed).length
    : 0;
  
  const totalLessons = lessonProgress
    ? lessonProgress.length
    : 5; // Default value if data is not available
  
  const lessonsPercentage = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  return (
    <ChildLayout title="My Home">
      {/* Welcome Section with Gradient Background */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-700 dark:text-primary-300 mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Ready for a wonderful day with Jesus?
            </p>
            
            <div className="flex items-center space-x-3 mb-4">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily Bible Challenge</div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Screen Time Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Clock className="h-6 w-6 text-primary-500 mr-2" />
                Today's Screen Time
              </h2>
              <span className="text-accent-500 dark:text-accent-400 font-medium">
                {screenTime ? `${screenTime.usedTimeMinutes}m of ${screenTime.allowedTimeMinutes + screenTime.additionalRewardMinutes}m` : "Loading..."}
              </span>
            </div>
            
            <Progress value={screenTimePercentage} className="h-4 mb-4" />
            
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Complete your Bible lessons to earn more screen time!</p>
              <Button className="mt-3 font-medium" variant="outline" asChild>
                <Link href="/lessons">
                  View Bible Lessons
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Bible Verse of the Day */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <Bookmark className="h-6 w-6 text-accent-500 mr-2" />
              Today's Verse
            </h2>
            
            <div className="mb-4 p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200 font-serif italic mb-2">
                "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
              </p>
              <p className="text-right text-sm font-medium text-accent-700 dark:text-accent-400">
                John 3:16 (NIrV)
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Try to memorize this verse today!</p>
              <Button className="font-medium" variant="outline">
                Practice Memory Verse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bible Lessons Section */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Bible Lessons</h2>
          
          {progressLoading ? (
            <div className="py-4 text-center text-gray-500">Loading your lessons...</div>
          ) : (
            <div className="space-y-4">
              {/* First two lessons are shown, assumes we have at least 3 lessons in the database */}
              {lessonProgress && lessonProgress.slice(0, 3).map((item, index) => (
                <div 
                  key={item.lesson.id} 
                  className={`p-4 rounded-lg ${
                    item.completed 
                      ? "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600" 
                      : index === 0 
                        ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
                        : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full ${
                        item.completed 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                          : index === 0
                            ? "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      } flex items-center justify-center`}>
                        {item.completed ? (
                          <Check className="h-5 w-5" />
                        ) : index === 0 ? (
                          <Book className="h-5 w-5" />
                        ) : (
                          <Lock className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">{item.lesson.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.lesson.verseRef}</p>
                      </div>
                    </div>
                    {item.completed ? (
                      <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                        Completed
                      </div>
                    ) : index === 0 ? (
                      <Button size="sm">
                        Continue
                      </Button>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Button asChild variant="outline" className="py-2 px-6 text-sm font-medium">
              <Link href="/lessons">
                View All Lessons
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Rewards Section */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Rewards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-accent-50 dark:bg-accent-900/20 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-accent-100 dark:bg-accent-900/50 text-accent-600 dark:text-accent-400 mb-3">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Bible Explorer</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Completed 10 lessons</p>
            </div>
            
            <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 mb-3">
                <Medal className="h-6 w-6" />
              </div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Memory Master</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Memorized 5 verses</p>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 mb-3">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Scripture Champion</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete 7 more lessons</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Extra Game Time</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Complete today's Bible lesson to earn +15 minutes</p>
              </div>
              <Button asChild variant="secondary">
                <Link href="/lessons">
                  Start Lesson
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ChildLayout>
  );
}
