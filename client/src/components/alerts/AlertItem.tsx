import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Alert } from "@/types/alert";

interface AlertItemProps {
  alert: Alert;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const { toast } = useToast();

  const handleAction = async (action: "approve" | "deny") => {
    try {
      await apiRequest("POST", `/api/alerts/${alert.id}/action`, { action });

      toast({
        title: action === "approve" ? "Approved" : "Denied",
        description: `Request has been ${action === "approve" ? "approved" : "denied"} successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread"] });
    } catch (error) {
      toast({
        title: "Action failed",
        description: error instanceof Error ? error.message : "Failed to process request",
        variant: "destructive",
      });
    }
  };

  const getAvatarImage = () => {
    if (alert.type.includes("friend")) {
      return "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=100&h=100";
    } else if (alert.type.includes("game")) {
      return "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=100&h=100";
    } else if (alert.type.includes("scripture")) {
      return "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=100&h=100";
    }
    return "https://images.unsplash.com/photo-1516627145497-ae6968895b40?auto=format&fit=crop&w=100&h=100";
  };

  const avatarImage = getAvatarImage();
  const firstInitial = alert.type.charAt(0).toUpperCase();
  const timeAgo = alert.createdAt
    ? formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })
    : "recently";

  return (
    <div className={cn("p-4 border-b border-border", alert.read ? "opacity-80" : "")}>
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          <Avatar className="h-12 w-12 rounded-md">
            <AvatarImage src={avatarImage} alt="Alert" className="object-cover" />
            <AvatarFallback>{firstInitial}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{alert.type}</h4>
          <p className="text-sm text-muted-foreground mb-2">{alert.content}</p>

          {!alert.handled && alert.type.includes("request") && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="default"
                className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleAction("approve")}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => handleAction("deny")}
              >
                Deny
              </Button>
            </div>
          )}

          <span className="text-xs text-muted-foreground mt-2 block">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;

