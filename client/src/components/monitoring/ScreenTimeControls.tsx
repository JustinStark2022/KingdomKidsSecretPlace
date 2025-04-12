import React, { useState } from "react";
import {
  Clock, Calendar, Smartphone, BarChart, Trash2
} from "lucide-react";
import {
  Card, CardContent, Button, Skeleton, Slider, Switch, Label,
  Input, Tabs, TabsContent, TabsList, TabsTrigger,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user";

interface ScreenTimeData {
  user: User;
  dailyLimits: {
    total: number;
    gaming: number;
    social: number;
    educational: number;
  };
  usageToday: {
    total: number;
    gaming: number;
    social: number;
    educational: number;
  };
  timeRewards: {
    fromScripture: number;
    fromLessons: number;
    fromChores: number;
  };
  schedule: {
    id: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    enabled: boolean;
  }[];
  blockedApps: {
    id: number;
    name: string;
    category: string;
    blocked: boolean;
  }[];
}

const ScreenTimeControls: React.FC = () => {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [newSchedule, setNewSchedule] = useState({
    dayOfWeek: "monday",
    startTime: "08:00",
    endTime: "21:00"
  });
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const { data: children, isLoading: childrenLoading } = useQuery<User[]>({
    queryKey: ["/api/users/children"]
  });

  const { data: screenTimeData, isLoading } = useQuery<ScreenTimeData>({
    queryKey: ["/api/screen-time", selectedChild],
    enabled: !!selectedChild
  });

  const updateScreenTimeMutation = useMutation({
    mutationFn: async (data: { type: string; value: number }) =>
      apiRequest("PUT", `/api/screen-time/${selectedChild}/limits`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/screen-time", selectedChild] });
      toast({ title: "Screen time updated", description: "New limits have been set." });
    },
    onError: (error) => {
      toast({
        title: "Error updating screen time",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  });

  const addScheduleMutation = useMutation({
    mutationFn: async (data: { dayOfWeek: string; startTime: string; endTime: string }) =>
      apiRequest("POST", `/api/screen-time/${selectedChild}/schedule`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/screen-time", selectedChild] });
      setScheduleDialogOpen(false);
      toast({ title: "Schedule added", description: "Screen time schedule added" });
    },
    onError: (error) => {
      toast({
        title: "Error adding schedule",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  });

  const toggleAppBlockMutation = useMutation({
    mutationFn: async ({ appId, blocked }: { appId: number; blocked: boolean }) =>
      apiRequest("PUT", `/api/screen-time/${selectedChild}/app/${appId}`, { blocked }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/screen-time", selectedChild] }),
    onError: (error) => {
      toast({
        title: "Error updating app block",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  });

  const handleScreenTimeUpdate = (type: string, value: number) => {
    updateScreenTimeMutation.mutate({ type, value });
  };

  const handleAddSchedule = () => {
    addScheduleMutation.mutate(newSchedule);
  };

  const handleToggleAppBlock = (appId: number, blocked: boolean) => {
    toggleAppBlockMutation.mutate({ appId, blocked });
  };

  const getDayLabel = (day: string) =>
    ({
      monday: "Mon", tuesday: "Tue", wednesday: "Wed",
      thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun"
    }[day.toLowerCase()] || day);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const calculatePercentage = (used: number, limit: number) =>
    limit === 0 ? 0 : Math.min(Math.round((used / limit) * 100), 100);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="limits">
        <TabsList className="mb-4">
          <TabsTrigger value="limits"><Clock className="h-4 w-4 mr-2" />Time Limits</TabsTrigger>
          <TabsTrigger value="schedule"><Calendar className="h-4 w-4 mr-2" />Schedule</TabsTrigger>
          <TabsTrigger value="apps"><Smartphone className="h-4 w-4 mr-2" />Apps</TabsTrigger>
          <TabsTrigger value="rewards"><BarChart className="h-4 w-4 mr-2" />Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="limits">
          {screenTimeData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(screenTimeData.dailyLimits).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label>{key.toUpperCase()}</Label>
                  <Slider
                    defaultValue={[value]}
                    max={600}
                    step={15}
                    onValueChange={([val]) => handleScreenTimeUpdate(key, val)}
                  />
                  <p className="text-muted-foreground text-sm">
                    Used: {formatTime(screenTimeData.usageToday[key as keyof typeof screenTimeData.usageToday])} / {formatTime(value)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule">
          <Button onClick={() => setScheduleDialogOpen(true)}>Add Schedule</Button>
          <div className="mt-4 space-y-2">
            {screenTimeData?.schedule.map(s => (
              <div key={s.id} className="flex items-center justify-between border p-2 rounded">
                <span>{getDayLabel(s.dayOfWeek)}: {s.startTime} - {s.endTime}</span>
                <Switch checked={s.enabled} disabled />
              </div>
            ))}
          </div>
          <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Schedule</DialogTitle>
                <DialogDescription>Choose the day and time range.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Label>Day of Week</Label>
                <Input
                  value={newSchedule.dayOfWeek}
                  onChange={(e) => setNewSchedule({ ...newSchedule, dayOfWeek: e.target.value })}
                />
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newSchedule.startTime}
                  onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                />
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newSchedule.endTime}
                  onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleAddSchedule}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="apps">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {screenTimeData?.blockedApps.map(app => (
              <Card key={app.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">{app.name}</h4>
                    <p className="text-sm text-muted-foreground">{app.category}</p>
                  </div>
                  <Switch
                    checked={app.blocked}
                    onCheckedChange={(val) => handleToggleAppBlock(app.id, val)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {screenTimeData && Object.entries(screenTimeData.timeRewards).map(([source, minutes]) => (
              <Card key={source}>
                <CardContent className="p-4">
                  <h4 className="font-bold capitalize">{source.replace("from", "From ")}</h4>
                  <p className="text-muted-foreground">{formatTime(minutes)} earned</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScreenTimeControls;
