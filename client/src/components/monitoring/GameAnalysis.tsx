import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  ThumbsDown,
  GamepadIcon,
  Filter
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { GameMonitoring } from "@/types/game";

const GameAnalysis: React.FC = () => {
  const { toast } = useToast();
  const [selectedGame, setSelectedGame] = useState<GameMonitoring | null>(null);

  const { data: games, isLoading } = useQuery<GameMonitoring[]>({
    queryKey: ["/api/games/monitoring"]
  });

  const approvalMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      return apiRequest("PUT", `/api/games/monitoring/${id}`, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games/monitoring"] });
      toast({
        title: "Game updated",
        description: "Game approval status has been updated"
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating game",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  const handleApproval = (id: number, approved: boolean) => {
    approvalMutation.mutate({ id, approved });
  };

  const renderGameDetails = () => {
    if (!selectedGame) return null;

    const redFlags = selectedGame.redFlags || [];

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">{selectedGame.gameName}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{selectedGame.contentRating || "Not Rated"}</Badge>
                <Badge
                  variant={
                    selectedGame.approved === true
                      ? "default"
                      : selectedGame.approved === false
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {selectedGame.approved === true
                    ? "Approved"
                    : selectedGame.approved === false
                    ? "Blocked"
                    : "Pending Review"}
                </Badge>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <Button
                variant="default"
                onClick={() => handleApproval(selectedGame.id, true)}
                disabled={selectedGame.approved === true}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleApproval(selectedGame.id, false)}
                disabled={selectedGame.approved === false}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Block
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="rounded-full bg-primary/20 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Played</p>
                  <h4 className="text-2xl font-bold">
                    {Math.floor(selectedGame.screenTime / 60)}h {selectedGame.screenTime % 60}m
                  </h4>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="rounded-full bg-yellow-500/20 p-3">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Red Flags</p>
                  <h4 className="text-2xl font-bold">{redFlags.length}</h4>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="rounded-full bg-blue-500/20 p-3">
                  <GamepadIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Played</p>
                  <h4 className="text-sm font-medium">
                    {selectedGame.lastPlayed ? new Date(selectedGame.lastPlayed).toLocaleDateString() : "Never"}
                  </h4>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          <span className="text-primary neon-text">Game Analysis</span>
        </h2>
        <p className="text-muted-foreground">Review and manage your child's game content</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            Pending Review
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            Approved
          </TabsTrigger>
          <TabsTrigger value="blocked" className="flex items-center">
            <ThumbsDown className="mr-2 h-4 w-4" />
            Blocked
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            All Games
          </TabsTrigger>
        </TabsList>

        {["pending", "approved", "blocked", "all"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {isLoading ? (
                Array(4).fill(null).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                      </div>
                      <div className="mt-3 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : games && games.length > 0 ? (
                games
                  .filter((game) =>
                    tab === "all"
                      ? true
                      : tab === "pending"
                      ? game.approved === null
                      : tab === "approved"
                      ? game.approved === true
                      : game.approved === false
                  )
                  .map((game) => (
                    <Card
                      key={game.id}
                      className={`cursor-pointer hover:border-primary transition-colors ${
                        selectedGame?.id === game.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedGame(game)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{game.gameName}</h3>
                            <div className="flex space-x-2 mt-1">
                              <Badge variant="outline">{game.contentRating || "Not Rated"}</Badge>
                              {game.approved === true && <Badge variant="default">Approved</Badge>}
                              {game.approved === false && <Badge variant="destructive">Blocked</Badge>}
                              {game.approved === null && <Badge>Pending</Badge>}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>
                              <Clock className="h-4 w-4 inline mr-1" />
                              {Math.floor(game.screenTime / 60)}h {game.screenTime % 60}m played
                            </span>
                            <span>
                              {Array.isArray(game.redFlags) && game.redFlags.length > 0 ? (
                                <span className="text-red-500">
                                  <AlertCircle className="h-4 w-4 inline mr-1" />
                                  {game.redFlags.length} issues
                                </span>
                              ) : (
                                <span className="text-green-500">
                                  <CheckCircle className="h-4 w-4 inline mr-1" />
                                  No issues
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="col-span-2">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <GamepadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No games found</h3>
                      <p className="text-muted-foreground">
                        {tab === "pending"
                          ? "No games pending review"
                          : tab === "approved"
                          ? "No approved games yet"
                          : tab === "blocked"
                          ? "No blocked games"
                          : "No games detected yet"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            {selectedGame && renderGameDetails()}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GameAnalysis;