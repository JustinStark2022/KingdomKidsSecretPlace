import { useQuery } from "@tanstack/react-query";
import ParentLayout from "@/components/layout/parent-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  UserPlus,
  ShieldCheck,
  BookOpen,
  Clock2,
  Check,
  Lock,
  Eye,
  UserCog,
  PlusCircle,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function ParentDashboard() {
  const { user } = useAuth();
  
  // Fetch child accounts
  const { data: children = [], isLoading: isLoadingChildren } = useQuery({
    queryKey: ["/api/users/children"],
  });
  
  // Fetch flagged content
  const { data: flaggedContent = [], isLoading: isLoadingFlagged } = useQuery({
    queryKey: ["/api/games/flagged"],
  });

  return (
    <ParentLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Child Status Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Children Overview</h2>
          
          {isLoadingChildren ? (
            <div className="py-4 text-center text-gray-500">Loading children data...</div>
          ) : children.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-3">
                <UserPlus className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Child Accounts</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                You haven't added any child accounts yet. Add one to begin monitoring.
              </p>
              <Button asChild size="sm">
                <Link href="/children">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Child Account
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Child</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Today's Screen Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bible Progress</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {children.map((child) => (
                    <tr key={child.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-full" 
                              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${child.username}`} 
                              alt={`${child.firstName} ${child.lastName}`} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {child.firstName} {child.lastName.charAt(0)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Age 9
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">45m / 2h</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div className="bg-primary-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">3/5 Lessons</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div className="bg-accent-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Online
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <Button size="icon" variant="ghost" className="h-8 w-8 mr-1">
                          <UserCog className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <Button variant="link" asChild className="p-0">
                  <Link href="/children">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Child Account
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Recent Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Alerts</h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              {flaggedContent.length} New
            </span>
          </div>
          
          {isLoadingFlagged ? (
            <div className="py-4 text-center text-gray-500">Loading alerts...</div>
          ) : flaggedContent.length === 0 ? (
            <div className="py-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-3">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">All Clear</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No alerts at this time. We'll notify you when something needs attention.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {flaggedContent.map((content) => (
                <div 
                  key={content.id} 
                  className={`p-3 rounded-lg ${
                    content.flagReason === 'violence' 
                      ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500' 
                      : 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className={`text-sm font-medium ${
                      content.flagReason === 'violence' 
                        ? 'text-red-800 dark:text-red-300' 
                        : 'text-amber-800 dark:text-amber-300'
                    }`}>
                      Flagged Content
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">10 min ago</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {content.name} ({content.platform}) flagged for {content.flagReason}
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="text-xs"
                    >
                      Block
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-300 dark:border-gray-600">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Achievement</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Yesterday</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Bible lessons completed this week! 🎉
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <Button variant="link" asChild className="p-0">
              <Link href="/monitoring">
                View all alerts
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content Monitoring */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Content Monitoring</h2>
          <select className="text-sm rounded-md border-gray-300 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
            <option>All Children</option>
            {children.map((child) => (
              <option key={child.id}>{child.firstName} {child.lastName}</option>
            ))}
          </select>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="flagged">
          <TabsList className="mb-4 border-b border-gray-200 dark:border-gray-700 w-full justify-start">
            <TabsTrigger value="flagged">Recently Flagged</TabsTrigger>
            <TabsTrigger value="apps">Apps & Games</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="web">Web History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flagged">
            {isLoadingFlagged ? (
              <div className="py-4 text-center text-gray-500">Loading flagged content...</div>
            ) : flaggedContent.length === 0 ? (
              <div className="py-8 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Flagged Content</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  All content has been approved or no content has been flagged yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Content</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Child</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Flagged For</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {flaggedContent.map((content) => (
                      <tr key={content.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                              {content.contentType === 'game' && (
                                <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5v14" />
                                </svg>
                              )}
                              {content.contentType === 'video' && (
                                <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2z" />
                                </svg>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{content.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{content.platform}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-white capitalize">{content.contentType}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {children.length > 0 ? `${children[0].firstName}` : "All"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            content.flagReason === 'violence' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}>
                            {content.flagReason}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          Today, 10:23 AM
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <Button variant="link" className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-0 h-auto mr-2">
                            Allow
                          </Button>
                          <Button variant="link" className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-0 h-auto">
                            Block
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="apps">
            <div className="py-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Apps & Games</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View and manage installed apps and games on your children's devices.
              </p>
              <Button className="mt-4">
                View All Apps
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="youtube">
            <div className="py-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">YouTube Activity</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monitor what videos your children are watching on YouTube.
              </p>
              <Button className="mt-4">
                View YouTube Activity
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="web">
            <div className="py-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Web Browsing History</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                See what websites your children have visited.
              </p>
              <Button className="mt-4">
                View Browsing History
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <UserPlus className="text-primary-500 mr-3 h-6 w-6" />
              <h3 className="text-lg font-medium">Add Child Account</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Create a new account for your child to monitor their activities.
            </p>
            <Button className="w-full" asChild>
              <Link href="/children">
                Create Account
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <ShieldCheck className="text-secondary-500 mr-3 h-6 w-6" />
              <h3 className="text-lg font-medium">Content Filter</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Adjust content filtering settings for all your child accounts.
            </p>
            <Button className="w-full" variant="secondary" asChild>
              <Link href="/monitoring">
                Adjust Filters
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <BookOpen className="text-accent-500 mr-3 h-6 w-6" />
              <h3 className="text-lg font-medium">Bible Lessons</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Assign new Bible lessons and memory verses to your children.
            </p>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/lessons">
                Assign Lessons
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </ParentLayout>
  );
}
