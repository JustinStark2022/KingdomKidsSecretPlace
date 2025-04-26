import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ParentLayout from "@/components/layout/parent-layout";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { fetchChildren } from "@/api/children";
import { Child } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Clock, 
  Bell, 
  User, 
  Lock, 
  BookOpen, 
  Smile,
  Loader2,
  Gift
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: children = [] } = useQuery<Child[]>({
    queryKey: ["/api/users/children"],
    queryFn: fetchChildren,
  });

  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [notifications, setNotifications] = useState({
    contentAlerts: true,
    screenTimeAlerts: true,
    lessonCompletions: true,
    deviceUsage: true,
    biblePlan: true
  });
  const [contentFilters, setContentFilters] = useState({
    blockViolence: true,
    blockLanguage: true,
    blockOccult: true,
    blockBullying: true,
    blockSexual: true,
    blockBlasphemy: true
  });
  const [screenTimeSettings, setScreenTimeSettings] = useState({
    weekdayLimit: 120,
    weekendLimit: 180,
    lockafter9pm: true,
    pauseDuringBedtime: true,
    allowRewards: true,
    maxRewardTime: 60
  });

  const saveGeneralSettings = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings saved",
        description: "Your general settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveContentFilters = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Content filters updated",
        description: `Content filters have been updated for ${selectedChild === "all" ? "all children" : selectedChild}.`,
      });
    } catch (error) {
      toast({
        title: "Error saving content filters",
        description: "There was a problem saving your content filters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveScreenTimeSettings = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Screen time settings updated",
        description: `Screen time settings have been updated for ${selectedChild === "all" ? "all children" : selectedChild}.`,
      });
    } catch (error) {
      toast({
        title: "Error saving screen time settings",
        description: "There was a problem saving your screen time settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ParentLayout title="Settings">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <SettingsIcon className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>
        
        <Card className="mb-6 shadow-md border-0">
          <CardContent className="pt-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="content">Content Filters</TabsTrigger>
                <TabsTrigger value="screentime">Screen Time</TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <Bell className="h-5 w-5 mr-2 text-primary-500" />
                      Notification Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="content-alerts" className="font-medium">Content Alerts</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive alerts when inappropriate content is detected
                          </p>
                        </div>
                        <Switch
                          id="content-alerts"
                          checked={notifications.contentAlerts}
                          onCheckedChange={(checked) => setNotifications({...notifications, contentAlerts: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="screentime-alerts" className="font-medium">Screen Time Alerts</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get notifications about screen time limits
                          </p>
                        </div>
                        <Switch
                          id="screentime-alerts"
                          checked={notifications.screenTimeAlerts}
                          onCheckedChange={(checked) => setNotifications({...notifications, screenTimeAlerts: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="lesson-completions" className="font-medium">Lesson Completions</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Be notified when your child completes a Bible lesson
                          </p>
                        </div>
                        <Switch
                          id="lesson-completions"
                          checked={notifications.lessonCompletions}
                          onCheckedChange={(checked) => setNotifications({...notifications, lessonCompletions: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="device-usage" className="font-medium">Device Usage</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get alerts about new device logins or unusual usage
                          </p>
                        </div>
                        <Switch
                          id="device-usage"
                          checked={notifications.deviceUsage}
                          onCheckedChange={(checked) => setNotifications({...notifications, deviceUsage: checked})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <BookOpen className="h-5 w-5 mr-2 text-accent-500" />
                      Bible Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="default-translation">Default Bible Translation</Label>
                        <Select defaultValue="NIV">
                          <SelectTrigger id="default-translation">
                            <SelectValue placeholder="Select translation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NIrV">NIrV (New International Reader's Version)</SelectItem>
                            <SelectItem value="NIV">NIV (New International Version)</SelectItem>
                            <SelectItem value="NLT">NLT (New Living Translation)</SelectItem>
                            <SelectItem value="ERV">ERV (Easy-to-Read Version)</SelectItem>
                            <SelectItem value="CSB">CSB (Christian Standard Bible)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reading-plan">Daily Bible Reading Plan</Label>
                        <Select defaultValue="chronological">
                          <SelectTrigger id="reading-plan">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chronological">Chronological</SelectItem>
                            <SelectItem value="beginner">Beginner's Journey</SelectItem>
                            <SelectItem value="wisdom">Wisdom Literature</SelectItem>
                            <SelectItem value="gospels">Through the Gospels</SelectItem>
                            <SelectItem value="psalms">Psalms & Proverbs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <Label htmlFor="bible-plan-notifications" className="font-medium">Bible Plan Notifications</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive daily reminders for Bible readings
                        </p>
                      </div>
                      <Switch
                        id="bible-plan-notifications"
                        checked={notifications.biblePlan}
                        onCheckedChange={(checked) => setNotifications({...notifications, biblePlan: checked})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <Lock className="h-5 w-5 mr-2 text-green-500" />
                      Account Security
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={saveGeneralSettings} 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save General Settings"
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Content Filters Tab */}
              <TabsContent value="content">
                <div className="space-y-6">
                  <div className="mb-6">
                    <Label htmlFor="child-selector" className="text-base font-medium">Apply Settings To:</Label>
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                      <SelectTrigger id="child-selector" className="mt-2">
                        <SelectValue placeholder="Select child" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Children</SelectItem>
                        {children.map((child) => (
                          <SelectItem key={child.id} value={child.first_name}>
                            {child.first_name} {child.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <Shield className="h-5 w-5 mr-2 text-red-500" />
                      Content Filtering
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Control what type of content should be blocked for {selectedChild === "all" ? "all children" : selectedChild}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="filter-violence" className="font-medium">Block Violent Content</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Filter games, videos, and websites with violent themes
                          </p>
                        </div>
                        <Switch
                          id="filter-violence"
                          checked={contentFilters.blockViolence}
                          onCheckedChange={(checked) => setContentFilters({...contentFilters, blockViolence: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="filter-language" className="font-medium">Block Bad Language</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Filter content with profanity or inappropriate language
                          </p>
                        </div>
                        <Switch
                          id="filter-language"
                          checked={contentFilters.blockLanguage}
                          onCheckedChange={(checked) => setContentFilters({...contentFilters, blockLanguage: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="filter-occult" className="font-medium">Block Occult Content</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Filter content with witchcraft, magic, or occult themes
                          </p>
                        </div>
                        <Switch
                          id="filter-occult"
                          checked={contentFilters.blockOccult}
                          onCheckedChange={(checked) => setContentFilters({...contentFilters, blockOccult: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="filter-bullying" className="font-medium">Block Bullying Content</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Filter content that promotes bullying or harmful behavior
                          </p>
                        </div>
                        <Switch
                          id="filter-bullying"
                          checked={contentFilters.blockBullying}
                          onCheckedChange={(checked) => setContentFilters({...contentFilters, blockBullying: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="filter-sexual" className="font-medium">Block Sexual Content</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Filter content with sexual themes or inappropriate imagery
                          </p>
                        </div>
                        <Switch
                          id="filter-sexual"
                          checked={contentFilters.blockSexual}
                          onCheckedChange={(checked) => setContentFilters({...contentFilters, blockSexual: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="filter-blasphemy" className="font-medium">Block Blasphemous Content</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Filter content that includes blasphemy against Christian beliefs
                          </p>
                        </div>
                        <Switch
                          id="filter-blasphemy"
                          checked={contentFilters.blockBlasphemy}
                          onCheckedChange={(checked) => setContentFilters({...contentFilters, blockBlasphemy: checked})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <Smile className="h-5 w-5 mr-2 text-green-500" />
                      Kingdom AI Settings
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Configure how our AI analyzes content
                    </p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="filter-sensitivity">Filter Sensitivity</Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Low</span>
                          <Slider
                            id="filter-sensitivity"
                            defaultValue={[7]}
                            max={10}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-500">High</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ai-detection-mode">AI Detection Mode</Label>
                        <Select defaultValue="balanced">
                          <SelectTrigger id="ai-detection-mode">
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="relaxed">Relaxed - Less false positives</SelectItem>
                            <SelectItem value="balanced">Balanced - Recommended</SelectItem>
                            <SelectItem value="strict">Strict - Maximum protection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={saveContentFilters} 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Content Filters"
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Screen Time Tab */}
              <TabsContent value="screentime">
                <div className="space-y-6">
                  {/* Apply Settings To */}
                  <div className="mb-6">
                    <Label htmlFor="child-time-selector" className="text-base font-medium">Apply Settings To:</Label>
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                      <SelectTrigger id="child-time-selector" className="mt-2">
                        <SelectValue placeholder="Select child" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Children</SelectItem>
                        {children.map((child) => (
                          <SelectItem key={child.id} value={child.first_name}>
                            {child.first_name} {child.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      Daily Time Limits
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="weekday-limit">Weekday Limit ({screenTimeSettings.weekdayLimit} minutes)</Label>
                          <span className="text-sm text-gray-500">{Math.floor(screenTimeSettings.weekdayLimit / 60)}h {screenTimeSettings.weekdayLimit % 60}m</span>
                        </div>
                        <Slider
                          id="weekday-limit"
                          value={[screenTimeSettings.weekdayLimit]}
                          min={30}
                          max={360}
                          step={15}
                          onValueChange={(value) => setScreenTimeSettings({...screenTimeSettings, weekdayLimit: value[0]})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="weekend-limit">Weekend Limit ({screenTimeSettings.weekendLimit} minutes)</Label>
                          <span className="text-sm text-gray-500">{Math.floor(screenTimeSettings.weekendLimit / 60)}h {screenTimeSettings.weekendLimit % 60}m</span>
                        </div>
                        <Slider
                          id="weekend-limit"
                          value={[screenTimeSettings.weekendLimit]}
                          min={30}
                          max={480}
                          step={15}
                          onValueChange={(value) => setScreenTimeSettings({...screenTimeSettings, weekendLimit: value[0]})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <User className="h-5 w-5 mr-2 text-purple-500" />
                      Additional Controls
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="lock-after-9" className="font-medium">Lock Devices After 9 PM</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Automatically lock devices at bedtime
                          </p>
                        </div>
                        <Switch
                          id="lock-after-9"
                          checked={screenTimeSettings.lockafter9pm}
                          onCheckedChange={(checked) => setScreenTimeSettings({...screenTimeSettings, lockafter9pm: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pause-bedtime" className="font-medium">Pause During Bedtime</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Automatically pause devices during scheduled bedtime
                          </p>
                        </div>
                        <Switch
                          id="pause-bedtime"
                          checked={screenTimeSettings.pauseDuringBedtime}
                          onCheckedChange={(checked) => setScreenTimeSettings({...screenTimeSettings, pauseDuringBedtime: checked})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <Gift className="h-5 w-5 mr-2 text-accent-500" />
                      Reward Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="allow-rewards" className="font-medium">Allow Bible Rewards</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Grant additional screen time for completing Bible lessons
                          </p>
                        </div>
                        <Switch
                          id="allow-rewards"
                          checked={screenTimeSettings.allowRewards}
                          onCheckedChange={(checked) => setScreenTimeSettings({...screenTimeSettings, allowRewards: checked})}
                        />
                      </div>
                      
                      {screenTimeSettings.allowRewards && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="max-reward">Maximum Daily Reward ({screenTimeSettings.maxRewardTime} minutes)</Label>
                            <span className="text-sm text-gray-500">{Math.floor(screenTimeSettings.maxRewardTime / 60)}h {screenTimeSettings.maxRewardTime % 60}m</span>
                          </div>
                          <Slider
                            id="max-reward"
                            value={[screenTimeSettings.maxRewardTime]}
                            min={15}
                            max={120}
                            step={15}
                            onValueChange={(value) => setScreenTimeSettings({...screenTimeSettings, maxRewardTime: value[0]})}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={saveScreenTimeSettings} 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Screen Time Settings"
                    )}
                  </Button>
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ParentLayout>
  );
}
