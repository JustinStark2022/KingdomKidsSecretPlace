import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import ParentLayout from "@/components/layout/parent-layout";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin, Navigation, Clock, Phone, Smartphone, History,
  AlertTriangle, RefreshCw, Loader2, User, Home
} from "lucide-react";
import { Child } from "@/types/user";

interface LocationData {
  userId: number;
  latitude: string;
  longitude: string;
  timestamp: string;
  deviceInfo: string;
}

export default function LocationTracking() {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const { data: children = [] } = useQuery<Child[]>({
    queryKey: ["/api/user/children"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user/children");
      return res.json();
    },
  });

  const {
    data: locationData,
    isLoading: locationLoading,
    refetch: refetchLocation,
    isError: locationError,
  } = useQuery<LocationData>({
    queryKey: [`/api/location/${selectedChild}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/location/${selectedChild}`);
      return res.json();
    },
    enabled: !!selectedChild,
    refetchInterval: autoRefresh ? 30000 : false,
  });

  useEffect(() => {
    if (!selectedChild && children.length > 0) {
      setSelectedChild(children[0].id.toString());
    }
  }, [children, selectedChild]);

  const handleRefresh = () => {
    if (selectedChild) {
      refetchLocation();
      toast({ title: "Refreshing location", description: "Getting the latest location data..." });
    }
  };

  const updateLocationMutation = useMutation({
    mutationFn: async (data: { latitude: string; longitude: string; deviceInfo: string }) => {
      const res = await apiRequest("POST", "/api/location/update", data);
      return res.json();
    },
    onSuccess: () => {
      refetchLocation();
      toast({ title: "Location updated", description: "Child's location has been updated." });
    },
    onError: (error: any) => {
      toast({ title: "Error updating location", description: error.message, variant: "destructive" });
    },
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  const getTimeElapsed = (timestamp: string) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diff = now.getTime() - updateTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  const getSelectedChildName = () => {
    if (!selectedChild || !children.length) return "Child";
    const child = children.find(c => c.id.toString() === selectedChild);
    return child ? `${child.first_name} ${child.last_name}` : "Child";
  };

  const openInMaps = (latitude: string, longitude: string) => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  };

  return (
    <ParentLayout title="Location Tracking">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <MapPin className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-bold">Location Tracking</h1>
        </div>

        {/* Select Child and Refresh */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <label htmlFor="child-selector" className="block text-sm font-medium mb-1">
              Select Child
            </label>
            <Select value={selectedChild || ""} onValueChange={setSelectedChild}>
              <SelectTrigger id="child-selector" className="w-full">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id.toString()}>
                    {child.first_name} {child.last_name}
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
              <RefreshCw className={`h-4 w-4 mr-2 ${locationLoading ? "animate-spin" : ""}`} />
              Refresh Location
            </Button>
          </div>
        </div>

        {/* Location Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <Button onClick={handleRefresh} size="sm" className="mt-2">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-primary animate-pulse" />
                      </div>
                      <div className="z-10 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow-md">
                        <p className="text-sm font-medium">
                          Map view would appear here
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Location: {locationData.latitude}, {locationData.longitude}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Coordinates */}
                      <CardContent className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 mr-3" />
                          <div>
                            <h3 className="text-sm font-medium">Coordinates</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {locationData.latitude}, {locationData.longitude}
                            </p>
                          </div>
                        </div>
                      </CardContent>

                      {/* Timestamp */}
                      <CardContent className="bg-accent-50 dark:bg-accent-900/20 p-4 rounded-lg">
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 mr-3" />
                          <div>
                            <h3 className="text-sm font-medium">Last Updated</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {formatTimestamp(locationData.timestamp)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* Open in Maps */}
                    <div className="flex space-x-2">
                      <Button className="flex-1" onClick={() => openInMaps(locationData.latitude, locationData.longitude)}>
                        Open in Maps
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Quick Actions */}
            <Card className="border-0 shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-accent" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2">Send Message</Button>
                <Button variant="outline" className="w-full mb-2">Voice Call</Button>
                <Button variant="outline" className="w-full">Check-in Request</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
}
