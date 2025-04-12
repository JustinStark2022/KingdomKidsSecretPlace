import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarIcon, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { PrayerJournal as PrayerJournalType } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const PrayerJournal: React.FC = () => {
  const { toast } = useToast();
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Fetch prayer journal entries
  const { data: entries, isLoading } = useQuery<PrayerJournalType[]>({
    queryKey: ['/api/prayer-journal'],
  });

  // Create new prayer journal entry
  const createMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      await apiRequest("POST", "/api/prayer-journal", data);
    },
    onSuccess: () => {
      toast({
        title: "Prayer saved",
        description: "Your prayer has been added to your journal",
      });
      setNewTitle("");
      setNewContent("");
      queryClient.invalidateQueries({ queryKey: ['/api/prayer-journal'] });
    },
    onError: (error) => {
      toast({
        title: "Error saving prayer",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Update prayer journal entry
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; title: string; content: string }) => {
      await apiRequest("PUT", `/api/prayer-journal/${data.id}`, {
        title: data.title,
        content: data.content,
      });
    },
    onSuccess: () => {
      toast({
        title: "Prayer updated",
        description: "Your prayer journal entry has been updated",
      });
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['/api/prayer-journal'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating prayer",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete prayer journal entry
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/prayer-journal/${id}`, undefined);
    },
    onSuccess: () => {
      toast({
        title: "Prayer deleted",
        description: "Your prayer journal entry has been deleted",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/prayer-journal'] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting prayer",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ title: newTitle, content: newContent });
  };

  const handleEdit = (entry: PrayerJournalType) => {
    setEditingId(entry.id);
    setEditTitle(entry.title);
    setEditContent(entry.content);
  };

  const handleUpdate = () => {
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        title: editTitle,
        content: editContent,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this prayer?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          <span className="text-primary neon-text">Prayer Journal</span>
        </h2>
        <p className="text-muted-foreground">Write down your prayers and thoughts about God</p>
      </div>

      <Tabs defaultValue="journal">
        <TabsList className="mb-4">
          <TabsTrigger value="journal">My Journal</TabsTrigger>
          <TabsTrigger value="new">New Prayer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="journal">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {editingId === entry.id ? (
                      <div className="p-4 space-y-3">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Prayer Title"
                          className="font-semibold text-lg"
                        />
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          placeholder="Write your prayer..."
                          className="min-h-[150px]"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleUpdate}>Save Changes</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{entry.title}</h3>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {entry.createdAt 
                                ? format(new Date(entry.createdAt), "MMMM d, yyyy") 
                                : "No date"}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(entry)}
                            >
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(entry.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 whitespace-pre-line">
                          {entry.content}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-medium mb-2">Your prayer journal is empty</h3>
                <p className="text-muted-foreground mb-4">
                  Start writing your prayers to keep track of your conversations with God
                </p>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Write a Prayer
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prayer-title">Title</Label>
                  <Input
                    id="prayer-title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What are you praying about?"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prayer-content">Prayer</Label>
                  <Textarea
                    id="prayer-content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Dear God..."
                    className="min-h-[200px]"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Saving..." : "Save Prayer"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrayerJournal;
