import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/types/alert";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import AlertItem from "./AlertItem";
import { cn } from "@/lib/utils";

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose }) => {
  // Fetch alerts from API
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    enabled: open, // Only fetch when panel is open
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div
        className={cn(
          "absolute top-0 right-0 bottom-0 w-full max-w-md bg-card shadow-xl",
          "transform transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-xl">Notifications</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 64px)" }}>
          {isLoading ? (
            Array(3)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="p-4 border-b border-border">
                  <div className="flex">
                    <Skeleton className="h-12 w-12 rounded-md mr-3" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex space-x-2 pt-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : alerts && alerts.length > 0 ? (
            alerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No new notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;

