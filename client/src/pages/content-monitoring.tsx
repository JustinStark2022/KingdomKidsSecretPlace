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
import { Child } from "@/types/user";
import { fetchChildren } from "@/api/children";
import { getFlaggedContent, FlaggedContent } from "@/api/monitoring";

export default function ContentMonitoring() {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState("all");
  const [activeTab, setActiveTab] = useState("flagged");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: children = [] } = useQuery<Child[]>({
    queryKey: ["children"],
    queryFn: fetchChildren,
  });

  const {
    data: flaggedContent = [],
    isLoading: isLoadingFlagged,
    error: flaggedError,
  } = useQuery<FlaggedContent[]>({
    queryKey: ["flaggedContent"],
    queryFn: getFlaggedContent,
  });

  const approveContentMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/games/approve/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games/flagged"] });
      toast({ title: "Content approved", description: "This content has been approved." });
    },
    onError: (error: any) => {
      toast({ title: "Error approving content", description: error.message, variant: "destructive" });
    },
  });

  const blockContentMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/games/block/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games/flagged"] });
      toast({ title: "Content blocked", description: "This content has been blocked." });
    },
    onError: (error: any) => {
      toast({ title: "Error blocking content", description: error.message, variant: "destructive" });
    },
  });

  const analyzeContentMutation = useMutation({
    mutationFn: async (data: { name: string; platform: string; description: string }) => {
      const res = await apiRequest("POST", "/api/ai/analyze-game", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/games/flagged"] });
      toast({
        title: data.flagged ? "Content flagged" : "Content approved",
        description: data.flagged
          ? `${data.name} was flagged for ${data.flagReason}`
          : `${data.name} was automatically approved as safe.`,
      });
    },
    onError: (error: any) => {
      toast({ title: "Error analyzing content", description: error.message, variant: "destructive" });
    },
  });

  const handleAnalyzeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("content-name") as HTMLInputElement)?.value;
    const platform = (form.elements.namedItem("content-platform") as HTMLSelectElement)?.value;
    const description = (form.elements.namedItem("content-description") as HTMLTextAreaElement)?.value;

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

  const filteredContent = flaggedContent.filter((content) =>
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
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger id="child-selector" className="w-[180px]">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Children</SelectItem>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id.toString()}>
                    {child.first_name} {child.last_name}
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
          <div className="md:col-span-2">
            <Card className="border-0 shadow-md">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <CardHeader className="pb-2">
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
                </CardHeader>
                <CardContent>
                  <TabsContent value="flagged">
                    {isLoadingFlagged ? (
                      <p>Loading flagged content...</p>
                    ) : flaggedContent.length === 0 ? (
                      <p>No flagged content.</p>
                    ) : (
                      <ul className="space-y-2">
                        {flaggedContent.map((flag) => (
                          <li key={flag.id} className="p-3 border-l-4 rounded border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                            <p className="text-sm font-medium">{flag.name}</p>
                            <p className="text-xs text-gray-500">
                              {flag.contentType} - {flag.flagReason}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>
                  <TabsContent value="games">
                    {flaggedContent.filter(c => c.contentType === 'game').map((flag) => (
                      <div key={flag.id} className="p-3 border rounded mb-2 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{flag.name}</p>
                          <p className="text-sm text-gray-500">{flag.flagReason}</p>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => approveContentMutation.mutate(flag.id)}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => blockContentMutation.mutate(flag.id)}>Block</Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="videos">
                    {flaggedContent.filter(c => c.contentType === 'video').map((flag) => (
                      <div key={flag.id} className="p-3 border rounded mb-2 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{flag.name}</p>
                          <p className="text-sm text-gray-500">{flag.flagReason}</p>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => approveContentMutation.mutate(flag.id)}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => blockContentMutation.mutate(flag.id)}>Block</Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="websites">
                    {flaggedContent.filter(c => c.contentType === 'website').map((flag) => (
                      <div key={flag.id} className="p-3 border rounded mb-2 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{flag.name}</p>
                          <p className="text-sm text-gray-500">{flag.flagReason}</p>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => approveContentMutation.mutate(flag.id)}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => blockContentMutation.mutate(flag.id)}>Block</Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
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
                  <Input id="content-name" name="content-name" placeholder="e.g., Minecraft" required />
                  <Select defaultValue="Roblox" name="content-platform">
                    <SelectTrigger id="content-platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Roblox">Roblox</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Android">Android</SelectItem>
                      <SelectItem value="iOS">iOS</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <textarea id="content-description" name="content-description" placeholder="Describe content..." className="min-h-[100px] w-full rounded-md border p-2 text-sm" />
                  <Button type="submit" className="w-full" disabled={analyzeContentMutation.isPending}>
                    {analyzeContentMutation.isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>) : ("Analyze Content")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
