import { useQuery } from "@tanstack/react-query";
import ParentLayout from "@/components/layout/parent-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  ShieldCheck,
  BookOpen,
  Check,
  Eye,
  UserCog,
  PlusCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Child } from "@/types/user";
import { fetchChildren } from "@/api/children";
import { getFlaggedContent, FlaggedContent } from "@/api/monitoring";
import React, { useState } from "react";

const childImages = [
  "/images/profile-boy-1.png",
  "/images/profile-boy-2.png",
  "/images/profile-girl.png",
];

// Mock Family Content Summary & Recommendation
function FamilySummary() {
  return (
    <ul className="list-disc pl-5 space-y-2 text-sm">
      <li>
        <b>1. Daily Bible Time:</b> Encourage each child to spend at least 10 minutes daily in Scripture. Start with Proverbs for wisdom for daily life.
      </li>
      <li>
        <b>2. Family Devotions:</b> Set aside time each week to read, discuss, and pray together as a family.
      </li>
      <li>
        <b>3. Serve Others:</b> Find ways to serve together, showing Christ’s love in action.
      </li>
      <li>
        <b>4. Encourage Questions:</b> Let children ask about faith and answer with Scripture and prayer.
      </li>
      <li>
        <b>5. Model Christlike Behavior:</b> Show kindness, forgiveness, and patience in your home.
      </li>
    </ul>
  );
}

// Mock Verse of the Day component
function VerseOfTheDay({ mode }: { mode: "auto" | "manual" }) {
  const [manualVerse, setManualVerse] = useState("Philippians 4:13 - I can do all things through Christ who strengthens me.");
  return (
    <div>
      <div className="mb-2">
        <span className="font-semibold text-blue-700">
          {mode === "auto"
            ? "Proverbs 3:5-6 - Trust in the Lord with all your heart and lean not on your own understanding."
            : manualVerse}
        </span>
      </div>
      {mode === "manual" && (
        <input
          className="border rounded px-2 py-1 w-full text-sm"
          value={manualVerse}
          onChange={e => setManualVerse(e.target.value)}
        />
      )}
    </div>
  );
}

// Mock Faith Fortress Chatbot
function FaithFortressChat() {
  return (
    <div className="absolute bg-white border rounded-xl shadow-lg p-4 h-[400px] w-full flex flex-col">
      <div className="flex items-center mb-2">
        <Sparkles className="text-blue-500 mr-2" />
        <h3 className="font-bold text-lg text-blue-700">Faith Fortress AI Chat</h3>
      </div>
      <div className="flex-1 text-gray-600 text-sm">
        <p>
          Welcome! I am your Faith Fortress AI, here to help guide your family closer to Jesus. Ask me anything about faith, parenting, or daily encouragement.
        </p>
        <div className="mt-4 italic text-gray-400">[Chat interface coming soon]</div>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const [verseMode, setVerseMode] = useState<"auto" | "manual">("auto");

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
      {/* Header */}
      <div className="flex items-center px-4 py-6 border-b bg-white mb-6">
        <img src="/logo.png" alt="Logo" className="w-14 h-14 mr-4" />
        <h1 className="text-3xl font-bold font-serif">My Faith Fortress Parent Dashboard</h1>
      </div>
      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Children Overview & Actions */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <Card>
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
                    {children.map((child, index) => (
                      <tr key={child.id} className="border-t">
                        <td className="py-3">
                          <div className="flex items-center">
                            <img
                              src={childImages[index]}
                              alt={`${child.first_name} ${child.last_name} Profile`}
                              className="w-12 h-12 rounded-full border border-gray-300 object-cover mr-4"
                            />
                            <span className="font-semibold mr-1">{child.username}</span>
                            <span className="text-gray-500">
                              ({child.first_name} {child.last_name})
                            </span>
                          </div>
                        </td>
                        <td>
                          {child.screenTime
                            ? `${child.screenTime.usage_today_total}m / ${child.screenTime.daily_limits_total}m`
                            : "—"}
                        </td>
                        <td>
                          {child.totalLessons != null
                            ? `${child.completedLessons}/${child.totalLessons}`
                            : "—"}
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
          {/* Action Cards */}
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <Card className="flex-1">
              <CardContent className="pt-6 flex flex-col items-center">
                <UserPlus className="text-primary-500 mb-2 h-6 w-6" />
                <span className="font-semibold mb-2">Create New Child Account</span>
                <Button asChild className="w-full mt-2">
                  <Link href="/children">Create Account</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="pt-6 flex flex-col items-center">
                <ShieldCheck className="text-secondary-500 mb-2 h-6 w-6" />
                <span className="font-semibold mb-2">Bible Education Control Center</span>
                <Button asChild className="w-full mt-2">
                  <Link href="/monitoring">Adjust Filters</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="pt-6 flex flex-col items-center">
                <BookOpen className="text-accent-500 mb-2 h-6 w-6" />
                <span className="font-semibold mb-2">Parental Controls Center</span>
                <Button asChild className="w-full mt-2">
                  <Link href="/lessons">Open Controls</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Right Column */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Family Content Summary & Recommendation */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Family Content Summary & Recommendation</h2>
              <FamilySummary />
            </CardContent>
          </Card>
          {/* Verse of the Day */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Verse of the Day</h2>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={verseMode}
                  onChange={e => setVerseMode(e.target.value as "auto" | "manual")}
                >
                  <option value="auto">Auto</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <VerseOfTheDay mode={verseMode} />
            </CardContent>
          </Card>
          {/* Recent Alerts */}
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
      </div>
      {/* Faith Fortress AI Chatbot */}
      <div className="fixed bottom-6 right-6 w-[400px] max-w-full z-50">
        <FaithFortressChat />
      </div>
    </ParentLayout>
  );
}
