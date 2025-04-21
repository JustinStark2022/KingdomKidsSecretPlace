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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Phone, 
  Smartphone, 
  History, 
  AlertTriangle, 
  RefreshCw, 
  Loader2,
  User,
  Home
} from "lucide-react";

// Define a sample type for location data
type LocationData = {
  userId: number;
  latitude: string;
  longitude: string;
  timestamp: string;
  deviceInfo: string;
};

export default function LocationTracking() {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  // Fetch children data
  const { data: children = [], isLoading: childrenLoading } = useQuery({
    queryKey: ["/api/users/children"],
  });

  // Set first child as selected by default when children data loads
  if (!selectedChild && children.length > 0 && !childrenLoading) {
    setSelectedChild(children[0].id.toString());
  }

  // Fetch location data for selected child
  const { 
    data: locationData, 
    isLoading: locationLoading,
    refetch: refetchLocation,
    isError: locationError
  } = useQuery<LocationData>({
    queryKey: [`/api/location/${selectedChild}`],
    enabled: !!selectedChild,
    refetchInterval: refreshInterval,
  });

  // Handle auto-refresh toggling
  useEffect(() => {
    if (autoRefresh) {
      setRefreshInterval(30000); // 30 seconds
    } else {
      setRefreshInterval(null);
    }
  }, [autoRefresh]);

  // Handle manual refresh
  const handleRefresh = () => {
    if (selectedChild) {
      refetchLocation();
      toast({
        title: "Refreshing location",
        description: "Getting the latest location data...",
      });
    }
  };

  // Mock updating child location (simulate GPS device)
  const updateLocationMutation = useMutation({
    mutationFn: async (data: {latitude: string, longitude: string, deviceInfo: string}) => {
      const res = await apiRequest("POST", "/api/location/update", data);
      return await res.json();
    },
    onSuccess: () => {
      refetchLocation();
      toast({
        title: "Location updated",
        description: "Child's location has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating location",
        description: error.message || "Could not update location",
        variant: "destructive",
      });
    },
  });

  // Format the timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  // Get time elapsed since last update
  const getTimeElapsed = (timestamp: string) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diff = now.getTime() - updateTime.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return "Just now";
    }
  };

  // Get selected child's name
  const getSelectedChildName = () => {
    if (!selectedChild || !children.length) return "Child";
    const child = children.find(c => c.id.toString() === selectedChild);
    return child ? `${child.firstName} ${child.lastName}` : "Child";
  };

  // Function to open a location in Google Maps
  const openInMaps = (latitude: string, longitude: string) => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  };

  return (
    <ParentLayout title="Location Tracking">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <MapPin className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-bold">Location Tracking</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <label htmlFor="child-location-selector" className="block text-sm font-medium mb-1">
              Select Child
            </label>
            <Select
              value={selectedChild || ""}
              onValueChange={setSelectedChild}
              disabled={childrenLoading || children.length === 0}
            >
              <SelectTrigger id="child-location-selector" className="w-full">
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
          
          <div className="w-full md:w-1/2 flex items-end">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleRefresh}
              disabled={!selectedChild || locationLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${locationLoading ? 'animate-spin' : ''}`} />
              Refresh Location
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Location Card */}
          <div className="md:col-span-2">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <Navigation className="h-5 w-5 mr-2 text-primary" />
                      Current Location
                    </CardTitle>
                    <CardDescription>
                      {selectedChild ? `Tracking ${getSelectedChildName()}` : "Select a child to track"}
                    </CardDescription>
                  </div>
                  
                  {locationData && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {getTimeElapsed(locationData.timestamp)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {!selectedChild ? (
                  <div className="py-12 text-center">
                    <User className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      Select a Child to Track
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose a child from the dropdown above to view their location
                    </p>
                  </div>
                ) : locationLoading ? (
                  <div className="py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Loading location data...</p>
                  </div>
                ) : locationError || !locationData ? (
                  <div className="py-12 text-center">
                    <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      No Location Data Available
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {locationError 
                        ? "There was an error retrieving location data." 
                        : "This child's location information hasn't been updated yet."}
                    </p>
                    <Button
                      onClick={handleRefresh}
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Map Placeholder - In production, this would be a real map */}
                    <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-primary animate-pulse" />
                      </div>
                      <div className="z-10 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow-md">
                        <p className="text-sm font-medium">Map view would appear here</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Location: {locationData.latitude}, {locationData.longitude}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                        <div className="flex items-start">
                          <div className="rounded-full bg-primary-100 dark:bg-primary-900/50 p-2 mr-3">
                            <MapPin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Coordinates</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {locationData.latitude}, {locationData.longitude}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                        <div className="flex items-start">
                          <div className="rounded-full bg-accent-100 dark:bg-accent-900/50 p-2 mr-3">
                            <Clock className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatTimestamp(locationData.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-start">
                          <div className="rounded-full bg-gray-200 dark:bg-gray-700 p-2 mr-3">
                            <Smartphone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Device</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {locationData.deviceInfo}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <div className="flex items-start">
                          <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-2 mr-3">
                            <Home className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Status</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              At Home
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        className="flex-1"
                        onClick={() => openInMaps(locationData.latitude, locationData.longitude)}
                      >
                        Open in Maps
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleRefresh}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              
              {locationData && (
                <CardFooter className="border-t pt-4">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        <Switch
                          id="auto-refresh"
                          checked={autoRefresh}
                          onCheckedChange={setAutoRefresh}
                        />
                        <Label htmlFor="auto-refresh" className="ml-2">
                          Auto-refresh
                        </Label>
                      </div>
                      {autoRefresh && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Updates every 30 seconds
                        </span>
                      )}
                    </div>
                    
                    <Button
                      variant="link"
                      size="sm"
                      className="text-gray-600 dark:text-gray-400"
                      asChild
                    >
                      <a href="#">View History</a>
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
          
          {/* Sidebar */}
          <div>
            {/* Quick Actions Card */}
            <Card className="border-0 shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-accent-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Communicate with {selectedChild ? getSelectedChildName() : "your child"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full">
                    Send Message
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    Voice Call
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    Check-in Request
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Safe Zones Card */}
            <Card className="border-0 shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Home className="h-5 w-5 mr-2 text-green-500" />
                  Safe Zones
                </CardTitle>
                <CardDescription>
                  Places your child frequently visits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <span className="font-medium text-sm">Home</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <span className="font-medium text-sm">School</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className="font-medium text-sm">Church</span>
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                      Inactive
                    </Badge>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  Add Safe Zone
                </Button>
              </CardContent>
            </Card>
            
            {/* Location History Card */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <History className="h-5 w-5 mr-2 text-primary-500" />
                  Location History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <History className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Location history will appear here
                    </p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View Full History
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Location data is stored securely and only accessible to you as the parent.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Demo Controls - For testing only */}
        {selectedChild && (
          <Card className="border-0 shadow-md mt-6">
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                Demo Controls (Simulates Child's Device)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateLocationMutation.mutate({
                    latitude: "40.7128",
                    longitude: "-74.0060",
                    deviceInfo: "iPhone 13"
                  })}
                  disabled={updateLocationMutation.isPending}
                >
                  Update to New York
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateLocationMutation.mutate({
                    latitude: "34.0522",
                    longitude: "-118.2437",
                    deviceInfo: "iPhone 13"
                  })}
                  disabled={updateLocationMutation.isPending}
                >
                  Update to Los Angeles
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateLocationMutation.mutate({
                    latitude: "41.8781",
                    longitude: "-87.6298",
                    deviceInfo: "iPhone 13"
                  })}
                  disabled={updateLocationMutation.isPending}
                >
                  Update to Chicago
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateLocationMutation.mutate({
                    latitude: "29.7604",
                    longitude: "-95.3698",
                    deviceInfo: "iPhone 13"
                  })}
                  disabled={updateLocationMutation.isPending}
                >
                  Update to Houston
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ParentLayout>
  );
}
