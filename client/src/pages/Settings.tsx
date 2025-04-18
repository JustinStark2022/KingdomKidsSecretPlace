import React, { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton
} from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { Settings as UserSettings } from "@shared/schema.ts";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Lock,
  UserPlus,
  Loader2
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const [newChildUsername, setNewChildUsername] = useState("");
  const [newChildPassword, setNewChildPassword] = useState("");
  const [newChildDisplayName, setNewChildDisplayName] = useState("");
  const [creatingChild, setCreatingChild] = useState(false);

  const { data: currentUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users/me"]
  });

  const { data: settings } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
    enabled: !!currentUser
  });

  const handleToggleSetting = (key: keyof UserSettings, value: boolean | number) => {
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
    <div className="h-full pt-6 ml-4 pl-9">
      <div
        className="absolute inset-0 z-0 bg-cover opacity-40 dark:opacity-30"
        style={{
          backgroundImage: "url('/images/settingsbg1.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }}
      />
      <div>
        <h1 className="pl-7 pt-1 text-5xl font-bold mb-2 logo-outlined">
          <span className="text-primary neon-text">Settings</span>
        </h1>
        <p className="pl-7 pb-8 text-3xl dark:text-white font-bold logo-outline">
          Customize your Kingdom Kids experience
        </p>
      </div>

      <Tabs
        className="w-full backdrop-blur-md"
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="ml-6 justify-left mb-4 border border-gray-200">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="hover:border-primary shadow-xl max-w-3xl ml-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Profile Settings</h2>
              {userLoading ? (
                <Skeleton className="h-6 w-32" />
              ) : (
                <div className="grid gap-6">
                  <Input value={currentUser?.username || ""} disabled placeholder="Username" />
                  <Input value={currentUser?.email || ""} disabled placeholder="Email" />
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family">
          <Card className="hover:border-primary backdrop-blur-md shadow-xl max-w-3xl ml-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Family Accounts</h2>
              <p className="text-muted-foreground text-sm">Manage children linked to your account.</p>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-4 flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-primary" />
                  Create Child Account
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="child-username">Username</Label>
                    <Input
                      id="child-username"
                      placeholder="e.g. kiddo123"
                      value={newChildUsername}
                      onChange={(e) => setNewChildUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="child-displayName">Display Name</Label>
                    <Input
                      id="child-displayName"
                      placeholder="e.g. Tommy"
                      value={newChildDisplayName}
                      onChange={(e) => setNewChildDisplayName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="child-password">Password</Label>
                    <Input
                      id="child-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Enter password"
                      value={newChildPassword}
                      onChange={(e) => setNewChildPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    onClick={async () => {
                      setCreatingChild(true);
                      try {
                        const res = await apiRequest("POST", "/api/users/create-child", {
                          username: newChildUsername,
                          password: newChildPassword,
                          displayName: newChildDisplayName
                        });

                        const data = await res.json();

                        if (res.ok) {
                          toast({
                            title: "Child created!",
                            description: `${data.child.displayName} added.`,
                          });
                          setNewChildUsername("");
                          setNewChildPassword("");
                          setNewChildDisplayName("");
                        } else {
                          toast({
                            title: "Error",
                            description: data?.message || "Failed to create child.",
                            variant: "destructive"
                          });
                        }
                      } catch {
                        toast({
                          title: "Error",
                          description: "Something went wrong.",
                          variant: "destructive"
                        });
                      } finally {
                        setCreatingChild(false);
                      }
                    }}
                    disabled={creatingChild}
                  >
                    {creatingChild ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" /> Creating...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" /> Create Child
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card className="hover:border-primary shadow-xl max-w-3xl ml-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Content Filter Settings</h2>
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Auto-Approve Christian Games</span>
                  <Switch
                    checked={settings?.autoApproveGames}
                    onCheckedChange={(val) => handleToggleSetting("autoApproveGames", val)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Auto-Approve Friend Requests</span>
                  <Switch
                    checked={settings?.autoApproveFriends}
                    onCheckedChange={(val) => handleToggleSetting("autoApproveFriends", val)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="hover:border-primary shadow-xl max-w-3xl ml-6">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="hover:border-primary shadow-xl max-w-3xl ml-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Security Settings</h2>
              <Input type="password" placeholder="Current Password" />
              <Input type="password" placeholder="New Password" />
              <Input type="password" placeholder="Confirm New Password" />
              <Button className="w-fit">
                <Lock className="mr-2 h-4 w-4" /> Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
