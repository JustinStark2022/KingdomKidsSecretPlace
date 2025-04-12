import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, CheckCircle, XCircle, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FriendRequest } from "@/types/friend";
import { User } from "@/types/user";

interface FriendRequestsProps {
  childId?: number;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ childId }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'denied'>('pending');
  const [selectedChild, setSelectedChild] = useState<number | undefined>(childId);

  const { data: children, isLoading: childrenLoading } = useQuery<User[]>({
    queryKey: ['/api/users/children']
  });

  const { data: friendRequests, isLoading } = useQuery<FriendRequest[]>({
    queryKey: ['/api/friend-requests', selectedChild],
    enabled: !!selectedChild
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'approved' | 'denied' }) => {
      return apiRequest("PUT", `/api/friend-requests/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/friend-requests', selectedChild] });
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications/unread'] });
      toast({
        title: "Friend request updated",
        description: "Friend request status has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating request",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  const handleStatusChange = (id: number, status: 'approved' | 'denied') => {
    updateStatusMutation.mutate({ id, status });
  };

  const filteredRequests = friendRequests?.filter(req => {
    if (activeTab === 'pending' && req.status !== 'pending') return false;
    if (activeTab === 'approved' && req.status !== 'approved') return false;
    if (activeTab === 'denied' && req.status !== 'denied') return false;
    if (searchQuery && !req.friendName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getAvatarFallback = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          <span className="text-primary neon-text">Friend Requests</span>
        </h2>
        <p className="text-muted-foreground">Review and manage your child's friend requests</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="w-full md:max-w-xs">
              {childId ? null : (
                <select
                  className="w-full p-2 rounded-md border border-border bg-background text-foreground"
                  value={selectedChild !== undefined ? String(selectedChild) : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedChild(val === "" ? undefined : parseInt(val, 10));
                  }}
                  disabled={childrenLoading}
                >
                  <option value="">Select a child</option>
                  {children?.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.displayName || child.username}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex space-x-2 w-full md:w-auto">
              {['pending', 'approved', 'denied'].map(tab => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab as 'pending' | 'approved' | 'denied')}
                  className="flex-1 md:flex-none capitalize"
                >
                  {tab}
                  {tab === 'pending' && friendRequests?.some(r => r.status === 'pending') && (
                    <Badge variant="secondary" className="ml-2">
                      {friendRequests.filter(r => r.status === 'pending').length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search friend requests..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {!selectedChild ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Select a child</h3>
              <p className="text-muted-foreground">
                Choose a child to view their friend requests
              </p>
            </CardContent>
          </Card>
        ) : isLoading ? (
          Array(3).fill(null).map((_, i) => (
            <Card key={i}><CardContent className="p-4 space-y-2"><Skeleton className="h-5 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
          ))
        ) : filteredRequests && filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{getAvatarFallback(request.friendName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">{request.friendName}</h3>
                      <Badge
                        variant={
                          request.status === 'denied'
                            ? 'destructive'
                            : 'outline'
                        }
                        className={cn(
                          request.status === 'approved' && 'bg-green-100 text-green-700 border border-green-200',
                          request.status === 'pending' && 'text-muted-foreground'
                        )}
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Request received: {format(new Date(request.requestDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className={cn("mt-4 flex justify-end space-x-2", request.status !== 'pending' && "opacity-50")}>
                  <Button
                    variant="outline"
                    className="text-destructive"
                    onClick={() => handleStatusChange(request.id, 'denied')}
                    disabled={request.status !== 'pending'}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Deny
                  </Button>
                  <Button
                    variant="outline"
                    className="text-green-600"
                    onClick={() => handleStatusChange(request.id, 'approved')}
                    disabled={request.status !== 'pending'}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No {activeTab} friend requests</h3>
              <p className="text-muted-foreground">
                There are no friend requests for this tab.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
