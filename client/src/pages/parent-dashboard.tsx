import { useQuery } from "@tanstack/react-query";
import ParentLayout from "@/components/layout/parent-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserPlus,
  ShieldCheck,
  BookOpen,
  Check,
  Eye,
  UserCog,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Child } from "@/types/user";
import { fetchChildren} from "@/api/children";
import { getFlaggedContent, FlaggedContent } from "@/api/monitoring";

export default function ParentDashboard() {
  const { user } = useAuth();

  const {
    data: children = [],
    isLoading: isLoadingChildren,
    error: childError,
  } = useQuery<Child[]>({
    queryKey: ["children"],
    queryFn: fetchChildren,
  });

  const {
    data: flaggedContent = [],
    isLoading: isLoadingFlagged,
    error: flaggedError,
  } = useQuery<FlaggedContent[]>({
    queryKey: ["flaggedContent"],
    queryFn: getFlaggedContent,
  });

  return (
    <ParentLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Child Overview */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Children Overview</h2>
            {isLoadingChildren ? (
              <p className="text-gray-500">Loading children...</p>
            ) : childError ? (
              <p className="text-red-500">Failed to load children.</p>
            ) : children.length === 0 ? (
              <div className="text-center">
                <UserPlus className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2">No child accounts found.</p>
                <Button asChild className="mt-4">
                  <Link href="/children">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Child Account
                  </Link>
                </Button>
              </div>
            ) : (
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr>
                    <th className="text-left">Child</th>
                    <th>Screen Time</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {children.map((child) => (
                    <tr key={child.id} className="border-t">
                      <td className="py-3">
                        <div className="flex items-center">
                          <img
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${child.username}`}
                            className="w-8 h-8 rounded-full mr-2"
                            alt="avatar"
                          />
                          <span className="font-semibold mr-1">{child.username}</span>
                          <span className="text-gray-500">({child.first_name} {child.last_name})</span>
                        </div>
                      </td>
                      <td>
                        {child.screenTime
                          ? `${child.screenTime.usage_today_total}m / ${child.screenTime.daily_limits_total}m`
                          : '—'}
                      </td>
                      <td>
                        {child.totalLessons != null
                          ? `${child.completedLessons}/${child.totalLessons}`
                          : '—'}
                      </td>
                      <td>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Online
                        </span>
                      </td>
                      <td>
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
            )}
          </CardContent>
        </Card>

        {/* Alerts Section */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
            {isLoadingFlagged ? (
              <p className="text-gray-500">Loading alerts...</p>
            ) : flaggedContent.length === 0 ? (
              <div className="text-center">
                <Check className="mx-auto h-8 w-8 text-green-500" />
                <p className="mt-2 text-sm">No flagged content.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {flaggedContent.map((flag) => (
                  <li
                    key={flag.id}
                    className={`p-3 border-l-4 rounded ${
                      flag.flagReason === "violence"
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                    }`}
                  >
                    <p className="text-sm font-medium">{flag.name}</p>
                    <p className="text-xs text-gray-500">
                      {flag.contentType} - {flag.flagReason}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <UserPlus className="text-primary-500 mb-2 h-6 w-6" />
            <h3 className="font-semibold text-lg mb-2">Add Child Account</h3>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              Monitor your child's device usage and activities.
            </p>
            <Button asChild className="w-full">
              <Link href="/children">Create Account</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <ShieldCheck className="text-secondary-500 mb-2 h-6 w-6" />
            <h3 className="font-semibold text-lg mb-2">Content Filters</h3>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              Adjust filters to block harmful content for all children.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/monitoring">Adjust Filters</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <BookOpen className="text-accent-500 mb-2 h-6 w-6" />
            <h3 className="font-semibold text-lg mb-2">Bible Lessons</h3>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              Assign devotionals and Bible verses for growth.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/lessons">Assign Lessons</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </ParentLayout>
  );
}
