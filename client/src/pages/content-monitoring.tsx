import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import ParentLayout from "@/components/layout/parent-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Gamepad2, 
  Youtube, 
  Globe, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Search
} from "lucide-react";

export default function ContentMonitoring() {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState("all");
  const [activeTab, setActiveTab] = useState("flagged");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch children
  const { data: children = [] } = useQuery({
    queryKey: ["/api/users/children"],
  });

  // Fetch flagged content
  const { data: flaggedContent = [], isLoading: isLoadingFlagged } = useQuery({
    queryKey: ["/api/games/flagged"],
  });

  // Mutations for allowing and blocking content
  const approveContentMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/games/approve/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games/flagged"] });
      toast({
        title: "Content approved",
        description: "This content has been approved for your child.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error approving content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const blockContentMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/games/block/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games/flagged"] });
      toast({
        title: "Content blocked",
        description: "This content has been blocked for your child.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error blocking content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Function to analyze a new game/app/video
  const analyzeContentMutation = useMutation({
    mutationFn: async (data: {name: string, platform: string, description: string}) => {
      const res = await apiRequest("POST", "/api/ai/analyze-game", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/games/flagged"] });
      toast({
        title: data.flagged ? "Content flagged" : "Content approved",
        description: data.flagged 
          ? `"${data.name}" was flagged for ${data.flagReason}` 
          : `"${data.name}" was automatically approved as safe`,
      });
      // Reset form if needed
    },
    onError: (error) => {
      toast({
        title: "Error analyzing content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyzeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("content-name") as HTMLInputElement).value;
    const platform = (form.elements.namedItem("content-platform") as HTMLSelectElement).value;
    const description = (form.elements.namedItem("content-description") as HTMLTextAreaElement).value;
    
    if (!name || !platform) {
      toast({
        title: "Missing information",
        description: "Please provide at least the name and platform.",
        variant: "destructive",
      });
      return;
    }
    
    analyzeContentMutation.mutate({ name, platform, description });
    form.reset();
  };

  // Filter flagged content based on search query
  const filteredContent = flaggedContent.filter(content => 
    content.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    content.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (content.flagReason && content.flagReason.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <ParentLayout title="Content Monitoring">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-bold">Content Monitoring</h1>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <label htmlFor="child-selector" className="mr-2 font-medium">Viewing:</label>
            <Select
              value={selectedChild}
              onValueChange={setSelectedChild}
            >
              <SelectTrigger id="child-selector" className="w-[180px]">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Children</SelectItem>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.firstName}>
                    {child.firstName} {child.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex w-[300px]">
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button variant="ghost" className="ml-1" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content Panel */}
          <div className="md:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="flagged" className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Flagged
                    </TabsTrigger>
                    <TabsTrigger value="games" className="flex items-center">
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      Games
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="flex items-center">
                      <Youtube className="h-4 w-4 mr-2" />
                      Videos
                    </TabsTrigger>
                    <TabsTrigger value="websites" className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Websites
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent className="pt-4">
                <TabsContent value="flagged" className="m-0">
                  {isLoadingFlagged ? (
                    <div className="py-10 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">Loading flagged content...</p>
                    </div>
                  ) : filteredContent.length === 0 ? (
                    <div className="py-10 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Clear!</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {searchQuery 
                          ? `No flagged content matches "${searchQuery}"` 
                          : "No content has been flagged for your attention."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredContent.map((content) => (
                        <div 
                          key={content.id} 
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex flex-col sm:flex-row justify-between mb-3">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center mr-3">
                                {content.contentType === 'game' && (
                                  <Gamepad2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                )}
                                {content.contentType === 'video' && (
                                  <Youtube className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                )}
                                {content.contentType === 'app' && (
                                  <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                )}
                                {content.contentType === 'website' && (
                                  <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                  {content.name}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <Badge variant="outline" className="text-sm">
                                    {content.platform}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-sm ${
                                      content.flagReason === 'violence' 
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
                                        : content.flagReason === 'language'
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
                                        : content.flagReason === 'occult'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                    }`}
                                  >
                                    Flagged: {content.flagReason}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-3 sm:mt-0">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => approveContentMutation.mutate(content.id)}
                                disabled={approveContentMutation.isPending}
                                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                              >
                                Allow
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => blockContentMutation.mutate(content.id)}
                                disabled={blockContentMutation.isPending}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              >
                                Block
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {content.description}
                          </p>
                          
                          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>Flagged for: {selectedChild === "all" ? "All children" : selectedChild}</span>
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" /> 
                              Today, 10:23 AM
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="games" className="m-0">
                  <div className="py-6 text-center">
                    <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Games & Apps</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-md mx-auto">
                      Monitor games and apps installed or accessed by your children. Use the analysis form to check if a game is appropriate.
                    </p>
                    <Button className="mt-4">
                      View All Games
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="videos" className="m-0">
                  <div className="py-6 text-center">
                    <Youtube className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">YouTube Activity</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-md mx-auto">
                      View your children's YouTube watch history and analyze videos for age-appropriate content.
                    </p>
                    <Button className="mt-4">
                      View YouTube History
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="websites" className="m-0">
                  <div className="py-6 text-center">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Web Browsing</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-md mx-auto">
                      Monitor web browsing history and manage which websites your children can access.
                    </p>
                    <Button className="mt-4">
                      View Browsing History
                    </Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar - Analysis Tool */}
          <div>
            <Card className="border-0 shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Analyze Content
                </CardTitle>
                <CardDescription>
                  Check if content is appropriate for your child
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnalyzeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="content-name" className="text-sm font-medium">
                      Content Name
                    </label>
                    <Input
                      id="content-name"
                      name="content-name"
                      placeholder="e.g., Minecraft, Fortnite, etc."
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="content-platform" className="text-sm font-medium">
                      Platform
                    </label>
                    <Select defaultValue="Roblox" name="content-platform">
                      <SelectTrigger id="content-platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Roblox">Roblox</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="Android">Android App</SelectItem>
                        <SelectItem value="iOS">iOS App</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="content-description" className="text-sm font-medium">
                      Description (Optional)
                    </label>
                    <textarea
                      id="content-description"
                      name="content-description"
                      placeholder="Provide details about the content..."
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={analyzeContentMutation.isPending}
                  >
                    {analyzeContentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Content"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Our Kingdom AI analyzes content based on Biblical values and flags potentially inappropriate material for your review.
                </p>
              </CardFooter>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-accent" />
                  Flagging Categories
                </CardTitle>
                <CardDescription>
                  Types of content we monitor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <span className="font-medium text-sm text-red-700 dark:text-red-300">Violence</span>
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      High Priority
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <span className="font-medium text-sm text-amber-700 dark:text-amber-300">Bad Language</span>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Medium Priority
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <span className="font-medium text-sm text-purple-700 dark:text-purple-300">Occult Themes</span>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      High Priority
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <span className="font-medium text-sm text-blue-700 dark:text-blue-300">Blasphemy</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      High Priority
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-pink-50 dark:bg-pink-900/20">
                    <span className="font-medium text-sm text-pink-700 dark:text-pink-300">Sexual Content</span>
                    <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-200">
                      High Priority
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  You can adjust filter sensitivity in <a href="/settings" className="text-primary hover:underline">Settings</a>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
