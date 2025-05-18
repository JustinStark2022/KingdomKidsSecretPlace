import { useState, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  Calendar,
  Hourglass,
  Gift,
  User,
  RefreshCw,
  BarChart3,
  Loader2,
  Plus,
  Minus,
  GraduationCap
} from "lucide-react";
import { Child } from "@/types/user";
import { fetchChildren } from "@/api/children";

interface ScreenTimeData {
  allowedTimeMinutes: number;
  additionalRewardMinutes: number;
  usedTimeMinutes: number;
}

export default function ScreenTime() {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState(15);

  const { data: children = [] } = useQuery<Child[]>({
    queryKey: ["children"],
    queryFn: fetchChildren,
  });

  useEffect(() => {
    if (!selectedChild && children.length > 0) {
      setSelectedChild(children[0].id.toString());
    }
  }, [children, selectedChild]);

  const { data: screenTime, isLoading: screenTimeLoading } = useQuery<ScreenTimeData>({
    queryKey: [`/api/screentime?userId=${selectedChild}&date=${selectedDate}`],
    enabled: !!selectedChild,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/screentime?userId=${selectedChild}&date=${selectedDate}`);
      return res.json();
    },
  });

  const updateScreenTimeMutation = useMutation({
    mutationFn: async (data: { userId: number, date: string, allowedTimeMinutes: number }) => {
      const res = await apiRequest("POST", "/api/screentime/update", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/screentime?userId=${selectedChild}&date=${selectedDate}`] });
      setIsAdjusting(false);
      toast({ title: "Screen time updated", description: "Screen time limits updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error updating screen time", description: error.message || "Could not update limits", variant: "destructive" });
    },
  });

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateTimeUsedPercentage = () => {
    if (!screenTime) return 0;
    const total = screenTime.allowedTimeMinutes + screenTime.additionalRewardMinutes;
    return total > 0 ? Math.min(100, Math.round((screenTime.usedTimeMinutes / total) * 100)) : 0;
  };

  const adjustAllowedTime = (amount: number) => {
    if (!screenTime || !selectedChild) return;
    const newAllowedTime = Math.max(15, screenTime.allowedTimeMinutes + amount);
    updateScreenTimeMutation.mutate({
      userId: parseInt(selectedChild),
      date: selectedDate,
      allowedTimeMinutes: newAllowedTime
    });
  };

  const getSelectedChildName = () => {
    if (!selectedChild || children.length === 0) return "Child";
    const child = children.find((c) => c.id.toString() === selectedChild);
    return child ? `${child.first_name} ${child.last_name}` : "Child";
  };

  const getRemainingTime = () => {
    if (!screenTime) return "No data";
    const total = screenTime.allowedTimeMinutes + screenTime.additionalRewardMinutes;
    const remaining = total - screenTime.usedTimeMinutes;
    return remaining > 0 ? formatMinutes(remaining) : "0m";
  };

  return (
    <ParentLayout title="Screen Time">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Clock className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-bold">Screen Time Management</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Child Select */}
          <div className="w-full md:w-1/3">
            <label htmlFor="child-selector" className="block text-sm font-medium mb-1">
              Select Child
            </label>
            <Select value={selectedChild || ""} onValueChange={setSelectedChild}>
              <SelectTrigger id="child-selector" className="w-full">
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 shadow-lg z-50">
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id.toString()}>
                    {child.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Select */}
          <div className="w-full md:w-1/3">
            <label htmlFor="date-selector" className="block text-sm font-medium mb-1">
              Select Date
            </label>
            <input
              type="date"
              id="date-selector"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Reset Date */}
          <div className="w-full md:w-1/3 flex items-end">
            <Button variant="outline" className="w-full" onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}>
              <Calendar className="h-4 w-4 mr-2" />
              Reset to Today
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {!selectedChild ? (
          <Card className="border-0 shadow-md">
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium">Select a Child</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Choose a child to view their screen time</p>
            </CardContent>
          </Card>
        ) : screenTimeLoading ? (
          <Card className="border-0 shadow-md">
            <CardContent className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Loading screen time data...</p>
            </CardContent>
          </Card>
        ) : !screenTime ? (
          <Card className="border-0 shadow-md">
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium">No Screen Time Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">No data for {selectedDate}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Usage Today Card */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Usage Today</CardTitle>
                <CardDescription>
                  {screenTime.usedTimeMinutes}m / {screenTime.allowedTimeMinutes + screenTime.additionalRewardMinutes}m
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={calculateTimeUsedPercentage()} className="h-2 rounded-full" />
              </CardContent>
            </Card>

            {/* Quick Adjust Card */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Quick Adjust</CardTitle>
              </CardHeader>
              <CardContent className="flex space-x-2">
                <Button onClick={() => adjustAllowedTime(-adjustmentAmount)} variant="outline">
                  -{adjustmentAmount}m
                </Button>
                <Button onClick={() => adjustAllowedTime(adjustmentAmount)}>
                  +{adjustmentAmount}m
                </Button>
              </CardContent>
            </Card>

            {/* Rewards Card */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Rewards Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{screenTime.additionalRewardMinutes}m</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
