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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Settings as UserSettings } from "@shared/schema";
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
  Trash2,
  Save
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "@/context/ThemeContext";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [addChildDialogOpen, setAddChildDialogOpen] = useState(false);
  const [newChildUsername, setNewChildUsername] = useState("");
  const [newChildPassword, setNewChildPassword] = useState("");
  const [newChildDisplayName, setNewChildDisplayName] = useState("");
  
  // Fetch current user
  const { data: currentUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/users/me'],
  });
  
  // Fetch user settings
  const { data: settings, isLoading: settingsLoading } = useQuery<UserSettings>({
    queryKey: ['/api/settings'],
    enabled: !!currentUser,
  });
  
  // Fetch children if parent
  const { data: children, isLoading: childrenLoading } = useQuery<User[]>({
    queryKey: ['/api/users/children'],
    enabled: !!currentUser && currentUser.isParent,
  });
  
  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<UserSettings>) => {
      return apiRequest("PUT", "/api/settings", updatedSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating settings",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Add child account mutation
  const addChildMutation = useMutation({
    mutationFn: async (childData: { username: string; password: string; displayName: string }) => {
      return apiRequest("POST", "/api/users/child", childData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/children'] });
      setAddChildDialogOpen(false);
      setNewChildUsername("");
      setNewChildPassword("");
      setNewChildDisplayName("");
      toast({
        title: "Child account created",
        description: "New child account has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating child account",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Delete child account mutation
  const deleteChildMutation = useMutation({
    mutationFn: async (childId: number) => {
      return apiRequest("DELETE", `/api/users/child/${childId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/children'] });
      toast({
        title: "Child account removed",
        description: "Child account has been removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing child account",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  const handleToggleSetting = (key: keyof UserSettings, value: boolean) => {
    if (settings) {
      updateSettingsMutation.mutate({ [key]: value });
    }
  };
  
  const handleScreenTimeChange = (value: string) => {
    if (settings) {
      updateSettingsMutation.mutate({ screenTimeLimit: parseInt(value) });
    }
  };
  
  const handleAddChild = () => {
    addChildMutation.mutate({
      username: newChildUsername,
      password: newChildPassword,
      displayName: newChildDisplayName
    });
  };
  
  const handleDeleteChild = (childId: number) => {
    if (window.confirm("Are you sure you want to remove this child account?")) {
      deleteChildMutation.mutate(childId);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-primary neon-text">Settings</span>
        </h1>
        <p className="text-muted-foreground">Customize your Kingdom Kids experience</p>
      </div>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          
          {currentUser?.isParent && (
            <>
              <TabsTrigger value="family" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Family Accounts
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Content Filters
              </TabsTrigger>
            </>
          )}
          
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          
          <TabsTrigger value="security" className="flex items-center">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                
                {userLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : currentUser ? (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <UserCircle className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{currentUser.displayName || currentUser.username}</h3>
                        <p className="text-muted-foreground">
                          {currentUser.isParent ? "Parent Account" : "Child Account"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          defaultValue={currentUser.username} 
                          disabled
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          defaultValue={currentUser.email} 
                          disabled
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                          id="displayName" 
                          defaultValue={currentUser.displayName || ""} 
                          placeholder="Enter your display name"
                          onChange={(e) => {
                            // Would update display name
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="darkMode">Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Switch between light and dark theme
                          </p>
                        </div>
                        <Switch 
                          id="darkMode" 
                          checked={theme === "dark"} 
                          onCheckedChange={toggleTheme}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="family">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Family Accounts</h2>
                <Dialog open={addChildDialogOpen} onOpenChange={setAddChildDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Child
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Child Account</DialogTitle>
                      <DialogDescription>
                        Create a new child account that will be linked to your parent account.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="childUsername">Username</Label>
                        <Input 
                          id="childUsername" 
                          value={newChildUsername}
                          onChange={(e) => setNewChildUsername(e.target.value)}
                          placeholder="Child's username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="childPassword">Password</Label>
                        <Input 
                          id="childPassword" 
                          type="password"
                          value={newChildPassword}
                          onChange={(e) => setNewChildPassword(e.target.value)}
                          placeholder="Create a password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="childDisplayName">Display Name</Label>
                        <Input 
                          id="childDisplayName" 
                          value={newChildDisplayName}
                          onChange={(e) => setNewChildDisplayName(e.target.value)}
                          placeholder="Child's name"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddChildDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddChild} disabled={addChildMutation.isPending}>
                        {addChildMutation.isPending ? "Adding..." : "Add Child"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {childrenLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : children && children.length > 0 ? (
                <div className="space-y-4">
                  {children.map((child) => (
                    <Card key={child.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <UserCircle className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{child.displayName || child.username}</h3>
                              <p className="text-xs text-muted-foreground">
                                Username: {child.username}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteChild(child.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Child Accounts</h3>
                  <p className="text-muted-foreground mb-4">
                    Add child accounts to monitor and manage their experience
                  </p>
                  <Button onClick={() => setAddChildDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Child
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Content Filter Settings</h2>
              
              {settingsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : settings ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-Approve Games</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically approve games with appropriate content ratings
                        </p>
                      </div>
                      <Switch 
                        checked={settings.autoApproveGames} 
                        onCheckedChange={(checked) => handleToggleSetting('autoApproveGames', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-Approve Friends</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically approve friend requests
                        </p>
                      </div>
                      <Switch 
                        checked={settings.autoApproveFriends} 
                        onCheckedChange={(checked) => handleToggleSetting('autoApproveFriends', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Daily Screen Time Limit</Label>
                      <Select 
                        value={settings.screenTimeLimit?.toString()} 
                        onValueChange={handleScreenTimeChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select limit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="180">3 hours</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Content Filter Strictness</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Adjust how strictly Kingdom Kids filters content for your child
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="strict" 
                            name="filter-level"
                            defaultChecked
                          />
                          <Label htmlFor="strict">Strict - Maximum protection</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="moderate" 
                            name="filter-level"
                          />
                          <Label htmlFor="moderate">Moderate - Balanced protection</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="relaxed" 
                            name="filter-level"
                          />
                          <Label htmlFor="relaxed">Relaxed - Minimal filtering</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Filter Settings
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
              
              {settingsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : settings ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about your child's activity
                        </p>
                      </div>
                      <Switch 
                        checked={settings.notifications} 
                        onCheckedChange={(checked) => handleToggleSetting('notifications', checked)}
                      />
                    </div>
                    
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="font-semibold">Notification Types</h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="friend-requests">Friend Requests</Label>
                          <Switch id="friend-requests" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="game-approvals">Game Approvals</Label>
                          <Switch id="game-approvals" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="achievements">Scripture Achievements</Label>
                          <Switch id="achievements" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="screen-time">Screen Time Alerts</Label>
                          <Switch id="screen-time" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="chat-flags">Chat Flags</Label>
                          <Switch id="chat-flags" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Notification Settings
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <Button className="mt-2">
                    Change Password
                  </Button>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="font-semibold mb-4">Account Security</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require Password for Purchases</Label>
                        <p className="text-sm text-muted-foreground">
                          Require password confirmation for all purchases
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Logout after Inactivity</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out after 30 minutes of inactivity
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
                  
                  <div className="space-y-4">
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
