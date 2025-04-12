import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle, 
  Clock, 
  Star, 
  ChevronRight,
  ArrowLeft
} from "lucide-react";

interface LessonDetailProps {
  lesson: BibleLesson;
  progress?: UserLessonProgress;
  onBackClick: () => void;
}

const LessonDetail: React.FC<LessonDetailProps> = ({ lesson, progress, onBackClick }) => {
  const [activeTab, setActiveTab] = useState<string>("lesson");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  // Mock questions for this lesson
  const questions = [
    {
      id: 1,
      question: "What key lesson can we learn from this Bible story?",
      options: [
        "God always provides for our needs",
        "We should ignore others' suffering",
        "Material possessions are most important",
        "Faith is seeing first, then believing"
      ],
      correct: "God always provides for our needs"
    },
    {
      id: 2,
      question: "Which scripture verse best supports the main theme?",
      options: [
        "John 3:16",
        "Philippians 4:19",
        "Genesis 1:1",
        "Psalm 23:1"
      ],
      correct: "Philippians 4:19"
    },
    {
      id: 3,
      question: "How can you apply this lesson in your daily life?",
      options: [
        "By trusting God in difficult situations",
        "By focusing only on myself",
        "By ignoring the Bible's teaching",
        "By worrying about everything"
      ],
      correct: "By trusting God in difficult situations"
    }
  ];
  
  const handleAnswerSelect = (answer: string) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answer });
  };
  
  const handleNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // Calculate score
      let score = 0;
      questions.forEach((q, index) => {
        if (userAnswers[index] === q.correct) {
          score++;
        }
      });
      
      setQuizScore(Math.round((score / questions.length) * 100));
      setQuizCompleted(true);
    }
  };
  
  const resetQuiz = () => {
    setQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBackClick}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{lesson.title}</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="lesson">
            <BookOpen className="h-4 w-4 mr-2" />
            Lesson
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <Star className="h-4 w-4 mr-2" />
            Quiz
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="lesson">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1000&h=400" 
                  alt="Bible Study" 
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                
                <div className="flex space-x-2 mb-4">
                  {lesson.ageRange && (
                    <Badge variant="outline">{lesson.ageRange}</Badge>
                  )}
                  <Badge variant="outline">
                    {lesson.scriptureReferences}
                  </Badge>
                </div>
                
                <div className="p-4 bg-muted/10 border rounded-md mb-6">
                  <h3 className="font-semibold mb-2">Key Scripture</h3>
                  <p className="italic font-serif">
                    "And my God will meet all your needs according to the riches of his glory in Christ Jesus." - Philippians 4:19
                  </p>
                </div>
                
                <div className="space-y-4">
                  {lesson.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-primary/10 border-primary/30 rounded-md border">
                <h3 className="font-semibold mb-2">Real-Life Application</h3>
                <p className="mb-2">
                  Think about a time when God provided for you or your family in an unexpected way. 
                  How did that make you feel? How can you trust God more in your daily life?
                </p>
                <p>
                  Remember that God loves you and will always provide what you truly need!
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={() => setActiveTab("quiz")}>
                Take the Quiz
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="quiz">
          <Card>
            <CardContent className="p-6">
              {quizCompleted ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center rounded-full bg-primary/20 p-4 mb-4">
                    {quizScore >= 70 ? (
                      <Award className="h-10 w-10 text-primary" />
                    ) : (
                      <BookOpen className="h-10 w-10 text-primary" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">
                    {quizScore >= 70 ? "Congratulations!" : "Good effort!"}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    You scored {quizScore}% on the quiz
                    {quizScore >= 70 ? 
                      ". You've earned 5 minutes of extra game time!" : 
                      ". Try again to earn game time rewards!"}
                  </p>
                  
                  <div className="space-y-2">
                    <Button onClick={resetQuiz}>Try Again</Button>
                    <Button variant="outline" onClick={onBackClick} className="ml-2">
                      Back to Lessons
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Quiz: {lesson.title}</h3>
                    <Badge variant="outline">
                      Question {questionIndex + 1} of {questions.length}
                    </Badge>
                  </div>
                  
                  <div className="mb-8">
                    <Progress 
                      value={((questionIndex + 1) / questions.length) * 100} 
                      className="mb-2"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4">
                      {questions[questionIndex].question}
                    </h4>
                    
                    <div className="space-y-3">
                      {questions[questionIndex].options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            userAnswers[questionIndex] === option
                              ? "border-primary bg-primary/10"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => handleAnswerSelect(option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleNextQuestion}
                      disabled={userAnswers[questionIndex] === undefined}
                    >
                      {questionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Lessons: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<BibleLesson | null>(null);
  
  // Fetch Bible lessons
  const { data: lessons, isLoading: lessonsLoading } = useQuery<BibleLesson[]>({
    queryKey: ['/api/bible-lessons'],
  });
  
  // Fetch user lesson progress
  const { data: progress, isLoading: progressLoading } = useQuery<UserLessonProgress[]>({
    queryKey: ['/api/user-lesson-progress'],
  });
  
  const getUserProgress = (lessonId: number) => {
    return progress?.find(p => p.lessonId === lessonId);
  };
  
  // If a lesson is selected, show the lesson detail view
  if (selectedLesson) {
    return (
      <LessonDetail 
        lesson={selectedLesson} 
        progress={getUserProgress(selectedLesson.id)} 
        onBackClick={() => setSelectedLesson(null)} 
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-primary neon-text">Bible</span> Lessons
        </h1>
        <p className="text-muted-foreground">Learn about God's Word through interactive lessons</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-block p-3 bg-primary/20 rounded-full mb-4">
                <Award className="h-8 w-8 text-primary" />
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
                      {progress?.filter(p => p.completed).length || 0}/{lessons?.length || 0} lessons
                    </span>
                  </div>
                  <Progress 
                    value={progress && lessons ? 
                      (progress.filter(p => p.completed).length / lessons.length) * 100 : 0
                    } 
                    className="mb-6"
                  />
                </>
              )}
              
              <div className="space-y-2 text-left">
                <h3 className="font-medium text-sm">Game Time Earned:</h3>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <span className="font-bold">
                    {progress ? progress.filter(p => p.completed).length * 5 : 0} minutes
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {lessonsLoading ? (
          Array(5).fill(null).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mx-auto mt-4" />
              </CardContent>
            </Card>
          ))
        ) : lessons && lessons.length > 0 ? (
          lessons.map(lesson => {
            const userProgress = getUserProgress(lesson.id);
            return (
              <Card 
                key={lesson.id} 
                className={`cursor-pointer hover:border-primary transition-colors ${
                  userProgress?.completed ? "border-green-500" : ""
                }`}
                onClick={() => setSelectedLesson(lesson)}
              >
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="inline-block p-3 bg-muted/20 rounded-full mb-3">
                      {userProgress?.completed ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : (
                        <GraduationCap className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {lesson.content.split('\n')[0]}
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                      {lesson.ageRange && (
                        <Badge variant="outline">{lesson.ageRange}</Badge>
                      )}
                      <Badge variant="outline">
                        {lesson.scriptureReferences}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      variant={userProgress?.completed ? "outline" : "default"}
                      size="sm"
                      className={userProgress?.completed ? "text-green-500" : ""}
                    >
                      {userProgress?.completed ? (
                        <>
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Completed
                        </>
                      ) : (
                        "Start Lesson"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No lessons available</h3>
              <p className="text-muted-foreground">
                Check back soon for new Bible lessons!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Lessons;

