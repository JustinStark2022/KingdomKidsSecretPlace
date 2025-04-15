import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { User, Settings as UserSettings } from "@shared/schema.ts";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UserCircle,
  Shield,
  Bell,
  Lock,
  Users,
  Plus,
  Save,
  XCircle,
  TimerReset,
  Zap,
  MessageCircle
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [newChildUsername, setNewChildUsername] = useState("");
  const [newChildPassword, setNewChildPassword] = useState("");
  const [newChildDisplayName, setNewChildDisplayName] = useState("");

  const { data: currentUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users/me"]
  });

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
    enabled: !!currentUser
  });

  const handleToggleSetting = (key: keyof UserSettings, value: boolean) => {
    if (settings) {
      apiRequest("PUT", "/api/settings", { [key]: value })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
          toast({ title: "Settings updated" });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Unknown error",
            variant: "destructive"
          });
        });
    }
  };

  return (
    <div className=" h-full pt-6   ml-4 pl-9 ">
      <div
        className="absolute inset-0 z-0 bg-cover  opacity-40 dark:opacity-30 "
        style={{ backgroundImage: "url('/images/settingsbg1.png')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'  }}
      />
      <div>
        <h1 className="pl-7 pt-1 text-5xl font-bold mb-2 logo-outlined">
          <span className="text-primary neon-text">Settings</span>
        </h1>
        <p className="pl-7 pb-8 text-3xl  dark:text-white font-bold logo-outline ">Customize your Kingdom Kids experience</p>
      </div>

      <Tabs className="w-full backdrop-blur-md " defaultValue="profile" value={activeTab} onValueChange={setActiveTab} >
        <TabsList className="ml-6 justify-left mb-4   border border-gray-200">
          <TabsTrigger value="profile" className="w-full pl-5 pr-8 py-2 backdrop-blur-md font-semibold text-md  text-gray-700 hover:bg-slate-200">
            Profile
          </TabsTrigger>
          <TabsTrigger value="family" className="w-full pl-8 pr-8 py-2 backdrop-blur-md font-semibold text-md text-gray-700 hover:bg-slate-200">
            Family
          </TabsTrigger>
          <TabsTrigger value="content" className="w-full pl-8 pr-8 py-2 backdrop-blur-md font-semibold text-md text-gray-700 hover:bg-slate-200">
            Content
          </TabsTrigger>
          <TabsTrigger value="notifications" className="w-full pl-8 pr-8 py-2 backdrop-blur-md font-semibold text-md text-gray-700 hover:bg-slate-200">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="w-full pl-8 pr-8 py-2 backdrop-blur-md font-semibold text-md text-gray-700 hover:bg-slate-200">
            Security
          </TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile">
          <Card className="hover:border-primary   shadow-xl max-w-3xl mr-auto ml-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Profile Settings</h2>
              {userLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <div className="grid gap-6">
                  <div>
                    <Input value={currentUser?.username || ""} disabled placeholder="Username" />
                  </div>
                  <div>
                    <Input value={currentUser?.email || ""} disabled placeholder="Email" />
                  </div>
                  
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAMILY TAB */}
        <TabsContent value="family">
          <Card className="hover:border-primary backdrop-blur-md shadow-xl max-w-3xl mr-auto ml-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Family Accounts</h2>
              <p className="text-muted-foreground text-sm">
                Add or manage your children linked to your account.
              </p>
              <div className="text-muted-foreground text-sm italic">
                To update children’s ages or grades, please contact support@kingdomkids.com
              </div>
              <div className="border rounded-lg p-4 ">
                <p className="text-muted-foreground">No children added yet.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENT FILTER TAB */}
        <TabsContent value="content">
          <Card className="hover:border-primary backdrop-blur-md shadow-xl max-w-3xl mr-auto ml-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Content Filter Settings</h2>
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Auto-Approve Christian Games
                  </span>
                  <Switch
                    checked={settings?.autoApproveGames}
                    onCheckedChange={(val) => handleToggleSetting("autoApproveGames", val)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Auto-Approve Friend Requests
                  </span>
                  <Switch
                    checked={settings?.autoApproveFriends}
                    onCheckedChange={(val) => handleToggleSetting("autoApproveFriends", val)}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Daily Screen Time Limit</p>
                  <Select
                    value={settings?.screenTimeLimit?.toString()}
                    onValueChange={(val) =>
                      handleToggleSetting("screenTimeLimit", parseInt(val) as any)
                    }
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications">
          <Card className="hover:border-primary backdrop-blur-md shadow-xl max-w-3xl mr-auto ml-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Notification Settings</h2>
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Enable Notifications</span>
                  <Switch
                    checked={settings?.notifications}
                    onCheckedChange={(val) => handleToggleSetting("notifications", val)}
                  />
                </div>
                <div className="space-y-2 border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Notify me about:</p>
                  <div className="grid gap-2">
                    {["Friend Requests", "Game Approvals", "Achievements", "Screen Time", "Chat Flags"].map((label, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security">
          <Card className="hover:border-primary backdrop-blur-md shadow-xl max-w-3xl mr-auto ml-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Security Settings</h2>
              <div className="grid gap-4">
                <Input type="password" placeholder="Current Password" />
                <Input type="password" placeholder="New Password" />
                <Input type="password" placeholder="Confirm New Password" />
                <Button className="w-fit">
                  <Lock className="mr-2 h-4 w-4" /> Change Password
                </Button>
              </div>

              <div className="pt-6 border-t space-y-4">
                <h3 className="font-semibold">Account Protection</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Require Password for Purchases
                  </span>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Auto-logout after 30 minutes
                  </span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="pt-6 border-t">
                <h3 className="text-sm text-destructive font-semibold mb-2">Danger Zone</h3>
                <Button variant="destructive" className="w-fit">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;