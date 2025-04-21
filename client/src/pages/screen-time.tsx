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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
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

export default function ScreenTime() {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Today in YYYY-MM-DD format
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustmentAmount, setAdjustmentAmount] = useState(15); // Default: 15 minutes

  // Fetch children data
  const { data: children = [], isLoading: childrenLoading } = useQuery({
    queryKey: ["/api/users/children"],
  });

  // Set first child as selected by default when children data loads
  if (!selectedChild && children.length > 0 && !childrenLoading) {
    setSelectedChild(children[0].id.toString());
  }

  // Fetch screen time data for selected child
  const { data: screenTime, isLoading: screenTimeLoading } = useQuery({
    queryKey: [`/api/screentime?userId=${selectedChild}&date=${selectedDate}`],
    enabled: !!selectedChild,
  });

  // Update screen time settings mutation
  const updateScreenTimeMutation = useMutation({
    mutationFn: async (data: {userId: number, date: string, allowedTimeMinutes: number}) => {
      const res = await apiRequest("POST", "/api/screentime/update", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/screentime?userId=${selectedChild}&date=${selectedDate}`],
      });
      setIsAdjusting(false);
      toast({
        title: "Screen time updated",
        description: "Screen time limits have been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating screen time",
        description: error.message || "Could not update screen time limits",
        variant: "destructive",
      });
    },
  });

  // Helper to format minutes into hours and minutes
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate percentages for progress bars
  const calculateTimeUsedPercentage = () => {
    if (!screenTime) return 0;
    const total = screenTime.allowedTimeMinutes + screenTime.additionalRewardMinutes;
    return Math.min(100, Math.round((screenTime.usedTimeMinutes / total) * 100));
  };

  // Increase/decrease allowed time
  const adjustAllowedTime = (amount: number) => {
    if (!screenTime || !selectedChild) return;
    
    const newAllowedTime = Math.max(15, screenTime.allowedTimeMinutes + amount);
    updateScreenTimeMutation.mutate({
      userId: parseInt(selectedChild),
      date: selectedDate,
      allowedTimeMinutes: newAllowedTime
    });
  };

  // Get selected child's name
  const getSelectedChildName = () => {
    if (!selectedChild || !children.length) return "Child";
    const child = children.find(c => c.id.toString() === selectedChild);
    return child ? `${child.firstName} ${child.lastName}` : "Child";
  };

  // Calculate remaining time
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
          <div className="w-full md:w-1/3">
            <label htmlFor="child-selector" className="block text-sm font-medium mb-1">
              Select Child
            </label>
            <Select
              value={selectedChild || ""}
              onValueChange={setSelectedChild}
              disabled={childrenLoading || children.length === 0}
            >
              <SelectTrigger id="child-selector" className="w-full">
                <SelectValue placeholder={
                  childrenLoading ? "Loading children..." : 
                  children.length === 0 ? "No children available" : 
                  "Select a child"
                } />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id.toString()}>
                    {child.firstName} {child.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
          
          <div className="w-full md:w-1/3 flex items-end">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                setSelectedDate(today);
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Reset to Today
            </Button>
          </div>
        </div>
        
        {!selectedChild ? (
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Select a Child
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose a child to view and manage their screen time
              </p>
            </CardContent>
          </Card>
        ) : screenTimeLoading ? (
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
              <p className="text-gray-600 dark:text-gray-400">Loading screen time data...</p>
            </CardContent>
          </Card>
        ) : !screenTime ? (
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No Screen Time Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No screen time data available for this child on {selectedDate}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Daily Overview Card */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Hourglass className="h-5 w-5 mr-2 text-primary" />
                    Daily Overview
                  </CardTitle>
                  <CardDescription>
                    {getSelectedChildName()}'s screen time for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Base Allowance</span>
                        <span className="font-medium">{formatMinutes(screenTime.allowedTimeMinutes)}</span>
                      </div>
                      <Progress value={100} className="h-2 bg-gray-200" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Reward Time</span>
                        <span className="font-medium">{formatMinutes(screenTime.additionalRewardMinutes)}</span>
                      </div>
                      <Progress value={100} className="h-2 bg-gray-200" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Time Used</span>
                        <span className="font-medium">{formatMinutes(screenTime.usedTimeMinutes)}</span>
                      </div>
                      <Progress 
                        value={calculateTimeUsedPercentage()} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="pt-2 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Remaining Today</span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          {getRemainingTime()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Adjustments Card */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2 text-accent" />
                    Adjust Limits
                  </CardTitle>
                  <CardDescription>
                    Change {getSelectedChildName()}'s screen time limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAdjusting ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Current Limit</span>
                        <span className="font-medium">{formatMinutes(screenTime.allowedTimeMinutes)}</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setAdjustmentAmount(prev => Math.max(15, prev - 15))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="px-4 py-2 border rounded-md min-w-[80px] text-center">
                          {adjustmentAmount}m
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setAdjustmentAmount(prev => Math.min(120, prev + 15))}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button
                          className="flex-1"
                          onClick={() => adjustAllowedTime(adjustmentAmount)}
                          disabled={updateScreenTimeMutation.isPending}
                        >
                          {updateScreenTimeMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>Increase</>
                          )}
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={() => adjustAllowedTime(-adjustmentAmount)}
                          disabled={updateScreenTimeMutation.isPending}
                          variant="outline"
                        >
                          {updateScreenTimeMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>Decrease</>
                          )}
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setIsAdjusting(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        className="w-full"
                        onClick={() => setIsAdjusting(true)}
                      >
                        Adjust Daily Limit
                      </Button>
                      
                      <div className="pt-2 pb-2 border-t border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium mb-2">Quick Adjustments</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustAllowedTime(30)}
                            disabled={updateScreenTimeMutation.isPending}
                          >
                            +30 Minutes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustAllowedTime(60)}
                            disabled={updateScreenTimeMutation.isPending}
                          >
                            +1 Hour
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustAllowedTime(-30)}
                            disabled={updateScreenTimeMutation.isPending}
                          >
                            -30 Minutes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustAllowedTime(-60)}
                            disabled={updateScreenTimeMutation.isPending}
                          >
                            -1 Hour
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Changing these limits affects only the base screen time allowance, 
                        not the additional time earned through Bible lessons.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Rewards Card */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-green-500" />
                    Bible Rewards
                  </CardTitle>
                  <CardDescription>
                    Additional time earned through Bible lessons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Reward Time</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {formatMinutes(screenTime.additionalRewardMinutes)}
                      </span>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-start">
                      <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-green-800 dark:text-green-300">
                          How It Works
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                          Each completed Bible lesson rewards your child with 15 minutes 
                          of additional screen time.
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a href="/lessons">
                        View Bible Lessons
                      </a>
                    </Button>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Bible reward time is automatically added when your child completes lessons.
                      It's a great way to encourage spiritual growth while allowing screen time.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Usage Insights */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Weekly Usage Insights
                </CardTitle>
                <CardDescription>
                  Screen time trends for {getSelectedChildName()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="usage">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                    <TabsTrigger value="rewards">Rewards</TabsTrigger>
                    <TabsTrigger value="limits">Limits</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="usage" className="space-y-4">
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Historical usage data will be shown here.
                      </p>
                      <div className="h-40 flex items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rewards" className="space-y-4">
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Weekly reward trends will be shown here.
                      </p>
                      <div className="h-40 flex items-center justify-center">
                        <Gift className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="limits" className="space-y-4">
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Limit adjustment history will be shown here.
                      </p>
                      <div className="h-40 flex items-center justify-center">
                        <Clock className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  These insights help you understand your child's screen time patterns and make informed decisions.
                </p>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </ParentLayout>
  );
}
