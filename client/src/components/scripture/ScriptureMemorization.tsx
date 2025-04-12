import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, CheckCircle2, Repeat, Clock, Star } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ScriptureProgress } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const ScriptureMemorization: React.FC = () => {
  const { toast } = useToast();
  const [activeScripture, setActiveScripture] = useState<ScriptureProgress | null>(null);
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [verseCompleted, setVerseCompleted] = useState(false);

  // Fetch scripture memory assignments
  const { data: scriptures, isLoading } = useQuery<ScriptureProgress[]>({
    queryKey: ['/api/scripture/progress'],
  });

  // Update progress mutation
  const progressMutation = useMutation({
    mutationFn: async (data: { id: number; progress: number; memorized: boolean }) => {
      return apiRequest("PUT", `/api/scripture/progress/${data.id}`, {
        progress: data.progress,
        memorized: data.memorized,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scripture/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/summary'] });
    },
    onError: (error) => {
      toast({
        title: "Error saving progress",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleStartPractice = (scripture: ScriptureProgress) => {
    setActiveScripture(scripture);
    setUserInput("");
    setShowHint(false);
    setVerseCompleted(false);
  };

  const checkProgress = () => {
    if (!activeScripture) return;
    
    // Simple check - count how many words the user got right
    const verseWords = activeScripture.content.toLowerCase().split(/\s+/);
    const inputWords = userInput.toLowerCase().split(/\s+/);
    
    let correctWords = 0;
    inputWords.forEach((word, i) => {
      if (i < verseWords.length && word === verseWords[i]) {
        correctWords++;
      }
    });
    
    const percentCorrect = Math.round((correctWords / verseWords.length) * 100);
    
    // Consider it memorized if they got at least 90% correct
    const isMemorized = percentCorrect >= 90;
    
    progressMutation.mutate({
      id: activeScripture.id,
      progress: percentCorrect,
      memorized: isMemorized,
    });
    
    if (isMemorized) {
      setVerseCompleted(true);
      toast({
        title: "Great job!",
        description: "You've successfully memorized this verse!",
      });
    } else {
      toast({
        title: "Keep practicing",
        description: `You got ${percentCorrect}% correct. Try again to improve!`,
      });
    }
  };

  const renderMemorizationStats = () => {
    if (!scriptures) return null;
    
    const totalScriptures = scriptures.length;
    const memorizedCount = scriptures.filter(s => s.memorized).length;
    const inProgressCount = scriptures.filter(s => !s.memorized && s.progress > 0).length;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="rounded-full bg-primary/20 p-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Memorized</p>
              <h4 className="text-2xl font-bold">{memorizedCount}</h4>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="rounded-full bg-yellow-500/20 p-3">
              <Repeat className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <h4 className="text-2xl font-bold">{inProgressCount}</h4>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="rounded-full bg-blue-500/20 p-3">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Verses</p>
              <h4 className="text-2xl font-bold">{totalScriptures}</h4>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          <span className="text-primary neon-text">Scripture Memorization</span>
        </h2>
        <p className="text-muted-foreground">Memorize Bible verses to earn extra game time!</p>
      </div>

      {!isLoading && renderMemorizationStats()}

      <Tabs defaultValue="verses">
        <TabsList className="mb-4">
          <TabsTrigger value="verses">My Verses</TabsTrigger>
          <TabsTrigger value="practice">Practice Mode</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="verses">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-60" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                      <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="mt-3">
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : scriptures && scriptures.length > 0 ? (
            <div className="space-y-4">
              {scriptures.map((scripture) => (
                <Card key={scripture.id} className={scripture.memorized ? "border-primary" : ""}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {scripture.scriptureReference}
                          {scripture.memorized && (
                            <Award className="h-4 w-4 text-primary inline ml-2" />
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 font-serif italic mt-1">
                          "{scripture.content}"
                        </p>
                      </div>
                      <Button
                        onClick={() => handleStartPractice(scripture)}
                        size="sm"
                        variant={scripture.memorized ? "outline" : "default"}
                      >
                        {scripture.memorized ? "Review" : "Practice"}
                      </Button>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{scripture.progress}%</span>
                      </div>
                      <Progress value={scripture.progress} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No verses to memorize yet</h3>
                <p className="text-muted-foreground mb-4">
                  Ask your parent to assign some scripture for you to memorize
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="practice">
          {activeScripture ? (
            <Card>
              <CardContent className="p-6">
                {verseCompleted ? (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-4 mb-4">
                      <Award className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                    <p className="text-muted-foreground mb-6">
                      You've successfully memorized {activeScripture.scriptureReference}
                    </p>
                    <div className="p-4 border rounded-lg mb-4 bg-muted/20">
                      <p className="text-center font-serif italic">
                        "{activeScripture.content}"
                      </p>
                    </div>
                    <Button onClick={() => setActiveScripture(null)}>
                      Choose Another Verse
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-2">
                      Memorizing: {activeScripture.scriptureReference}
                    </h3>
                    
                    <div className="p-4 border rounded-lg mb-4 bg-muted/20">
                      {showHint ? (
                        <p className="font-serif">
                          {activeScripture.content}
                        </p>
                      ) : (
                        <p className="text-center text-muted-foreground italic">
                          Try to recall the verse from memory
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="font-medium">Type the verse from memory:</label>
                        <textarea
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Type here..."
                        />
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setShowHint(!showHint)}
                        >
                          {showHint ? "Hide Hint" : "Show Hint"}
                        </Button>
                        
                        <div className="space-x-2">
                          <Button variant="outline" onClick={() => setActiveScripture(null)}>
                            Cancel
                          </Button>
                          <Button onClick={checkProgress}>Check Progress</Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-medium mb-2">Select a verse to practice</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a verse from the "My Verses" tab to start practicing
                </p>
                <Button onClick={() => document.querySelector('[value="verses"]')?.click()}>
                  Go to My Verses
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="rewards">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Earn Rewards for Memorizing</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-primary/20 p-2">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Memorize 1 verse</h4>
                      <p className="text-sm text-muted-foreground">5 minutes of game time</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Claim</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-purple-500/20 p-2">
                      <Star className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Memorize 5 verses</h4>
                      <p className="text-sm text-muted-foreground">15 minutes of game time</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Claim</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-blue-500/20 p-2">
                      <Star className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Memorize an entire chapter</h4>
                      <p className="text-sm text-muted-foreground">30 minutes of game time</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Claim</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-yellow-500/20 p-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">7-Day Streak</h4>
                      <p className="text-sm text-muted-foreground">Bonus 10 minutes of game time</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Claim</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScriptureMemorization;
