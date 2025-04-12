import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  AlertTriangle,
  Shield,
  Users,
  Calendar,
  Search,
  Flag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChatLog } from "@/types/chat";

const ChatMonitoring: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<ChatLog | null>(null);

  const { data: chatLogs, isLoading } = useQuery<ChatLog[]>({
    queryKey: ["/api/monitoring/chats"],
  });

  const filteredChats = chatLogs?.filter(
    (chat) =>
      chat.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.participants.some((p) =>
        p.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const flaggedChats = chatLogs?.filter((chat) => chat.flagged);
  const unflaggedChats = chatLogs?.filter((chat) => !chat.flagged);

  const renderChatList = (chats?: ChatLog[]) => {
    if (isLoading) {
      return Array(5)
        .fill(null)
        .map((_, i) => (
          <Card key={i} className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="mt-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
            </CardContent>
          </Card>
        ));
    }

    if (!chats || chats.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No chat logs found</h3>
            <p className="text-muted-foreground">
              No chat conversations have been recorded or match your filter
            </p>
          </CardContent>
        </Card>
      );
    }

    return chats.map((chat) => (
      <Card
        key={chat.id}
        className={`mb-4 cursor-pointer hover:border-primary transition-colors ${
          selectedChat?.id === chat.id ? "border-primary" : ""
        }`}
        onClick={() => setSelectedChat(chat)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold flex items-center">
                <span className="capitalize">{chat.platform}</span>
                {chat.flagged && (
                  <Badge variant="destructive" className="ml-2">
                    Flagged
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(chat.timestamp), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            <Badge variant="outline" className="capitalize">
              {chat.participants.length} {chat.participants.length === 1 ? "person" : "people"}
            </Badge>
          </div>

          <div className="mt-3">
            <p className="text-sm line-clamp-2">{chat.content}</p>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <Users className="h-3 w-3 mr-1" />
              <span>{chat.participants.join(", ")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const renderChatDetail = () => {
    if (!selectedChat) return null;

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center">
                <span className="capitalize">{selectedChat.platform} Conversation</span>
                {selectedChat.flagged && (
                  <Badge variant="destructive" className="ml-2">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Flagged Content
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(selectedChat.timestamp), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedChat(null)}>
              Close
            </Button>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Participants</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedChat.participants.map((participant, index) => (
                <Badge key={index} variant="secondary">
                  {participant}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-6 p-4 border rounded-md bg-muted/10">
            <h4 className="font-medium mb-2">Conversation Content</h4>
            <p className="whitespace-pre-line">{selectedChat.content}</p>
          </div>

          {selectedChat.flagged && selectedChat.flagReason && (
            <div className="mb-6 p-4 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/10 dark:border-red-900">
              <div className="flex items-center text-red-800 dark:text-red-300 mb-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <h4 className="font-medium">Flagged Reason</h4>
              </div>
              <p className="text-red-800 dark:text-red-300 text-sm">
                {selectedChat.flagReason}
              </p>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" className="text-red-500">
              <Flag className="mr-2 h-4 w-4" />
              Flag as Inappropriate
            </Button>
            <div className="space-x-2">
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Block User
              </Button>
              <Button variant="default">Take Action</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          <span className="text-primary neon-text">Chat Monitoring</span>
        </h2>
        <p className="text-muted-foreground">
          Review and monitor your child's chat conversations
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Monitoring Settings</h3>
              <div className="flex items-center space-x-2">
                <Switch id="ai-monitoring" defaultChecked />
                <Label htmlFor="ai-monitoring">AI Content Monitoring</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="keyword-alerts" defaultChecked />
                <Label htmlFor="keyword-alerts">Keyword Alerts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="unknown-contacts" defaultChecked />
                <Label htmlFor="unknown-contacts">Unknown Contact Alerts</Label>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h3 className="font-semibold">Monitoring Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-500/10 p-3 rounded-md border border-green-200 dark:border-green-900">
                  <h4 className="font-medium text-green-700 dark:text-green-400 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Protected
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Active monitoring enabled
                  </p>
                </div>
                <div className="bg-yellow-500/10 p-3 rounded-md border border-yellow-200 dark:border-yellow-900">
                  <h4 className="font-medium text-yellow-700 dark:text-yellow-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last Scan
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Today, 2:45 PM</p>
                </div>
                <div className="bg-red-500/10 p-3 rounded-md border border-red-200 dark:border-red-900">
                  <h4 className="font-medium text-red-700 dark:text-red-400 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Flags
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isLoading
                      ? "Loading..."
                      : `${flaggedChats?.length || 0} flagged conversations`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search chat logs..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Chats</TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged
            {flaggedChats && flaggedChats.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {flaggedChats.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="safe">Safe Chats</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <TabsContent value="all" className="mt-0">
              {renderChatList(filteredChats)}
            </TabsContent>
            <TabsContent value="flagged" className="mt-0">
              {renderChatList(flaggedChats)}
            </TabsContent>
            <TabsContent value="safe" className="mt-0">
              {renderChatList(unflaggedChats)}
            </TabsContent>
          </div>

          <div className="space-y-4">
            {selectedChat ? (
              renderChatDetail()
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No chat selected</h3>
                  <p className="text-muted-foreground">
                    Select a chat from the list to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ChatMonitoring;
