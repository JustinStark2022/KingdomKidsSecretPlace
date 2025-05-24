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
  Send,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Child } from "@/types/user";
import { fetchChildren } from "@/api/children";
import { getFlaggedContent, FlaggedContent } from "@/api/monitoring";
import React, { useRef, useState } from "react";

const childImages = [
  "/images/profile-girl.png",
  "/images/profile-boy-2.png",
  "/images/profile-boy-1.png",
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

interface ChatMessage {
  sender: "bot" | "user";
  text: string;
}

const initialMessages: ChatMessage[] = [
  {
    sender: "bot",
    text: "👋 Hi! I'm your Faith Fortress AI Chatbot. How can I help you today?",
  },
];

export default function ParentDashboard() {
  const { user } = useAuth();
  const [verseMode, setVerseMode] = useState<"auto" | "manual">("auto");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Dummy send handler
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { sender: "user", text: input },
      {
        sender: "bot",
        text: "Thank you for your message! (AI response coming soon.)",
      },
    ]);
    setInput("");
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <ParentLayout title="My Faith Fortress Parent Dashboard">
      {/* Header */}
      {/* Main Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-8 gap-4">
        {/* Children Overview & Actions */}
        <div className="xl:col-span-10 flex flex-col gap-2">
          <div className="w-full max-h-[325px] xl:col-span-4 flex flex-row gap-4">
            <Card className="max-w-[600px] w-full ">
              <CardContent className="pt-2">
                <h2 className="text-md font-semibold mb-2">Children Overview</h2>
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
                        <th className=" mr-0 text-left">Child</th>
                        <th>Screen Time</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {children.map((child, index) => (
                        <tr key={child.id} className="border-t">
                          <td className="py-2">
                            <div className="flex items-center">
                              <img
                                src={childImages[index]}
                                alt={`${child.username} Profile`}
                                className="w-12 h-12 rounded-full border border-gray-300 object-cover mr-2"
                              />
                              <span className="font-semibold mr-1">{child.username}</span>
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
            {/* Family Content Summary & Recommendation */}
            <Card className="max-h-[325px] max-w-[450px]">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Family Content Summary & Recommendation</h2>
                <FamilySummary />
              </CardContent>
            </Card>
            {/* Recent Alerts */}
            <Card className="max-h-[325px] max-w-[215px]">
              <CardContent className="pt-3">
                <h2 className="text-md font-semibold mb-4">Recent Alerts</h2>
                {isLoadingFlagged ? (
                  <p className="text-gray-500">Loading alerts...</p>
                ) : flaggedContent.length === 0 ? (
                  <div className="text-center">
                    <Check className="mx-auto h-8 w-8 text-green-500" />
                    <p className="mt-1 text-sm">No flagged content.</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {flaggedContent.map((flag) => (
                      <li
                        key={flag.id}
                        className={`p-1 border-l-4 rounded ${
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
          <div className="xl:col-span-10 flex flex-row gap-2">
          {/* Action Cards, Verse of the Day, and Chat Side-by-Side */}
          <div className="flex flex-row gap-8 mt-2">
            {/* Left: Action Cards + Verse of the Day */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <Card className="flex-1 h-20 min-h-0 max-w-[190px]">
                  <CardContent className="py-1 flex flex-col items-center justify-center">
                    <span className="font-semibold text-xs mb-1 text-base text-center">Create New Child Account</span>
                    <Button asChild className="w-full max-w-[120px] h-5 mt-1 text-xs">
                      <Link href="/children">Create Account</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="flex-1 h-20 min-h-0 max-w-[190px]">
                  <CardContent className="py-1 flex flex-col items-center justify-center">
                    <span className="font-semibold mb-1 text-xs text-base text-center">Bible Education Control Center</span>
                    <Button asChild className="w-full max-w-[120px] h-5 mt-1 text-xs">
                      <Link href="/monitoring">Adjust Filters</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="flex-1 h-20 min-h-0 max-w-[190px]">
                  <CardContent className="py-1 flex flex-col items-center justify-center">
                    <span className="font-semibold mb-1 text-xs text-base text-center">Parental Controls Center</span>
                    <Button asChild className="w-full max-w-[120px] h-5 mt-1 text-xs">
                      <Link href="/lessons">Open Controls</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              {/* Verse of the Day */}
              <Card className="h-[100px] max-w-[585px]">
                <CardContent className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-md font-bold">Verse of the Day</h2>
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
            </div>
            {/* Right: Chatbot */}
            <Card className="min-w-[630] h-[180px] flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-blue-50 rounded-t-2xl">
                  <MessageCircle className="text-blue-500" />
                  <span className="font-semibold text-blue-900 text-lg">Faith Fortress Chat</span>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-blue-50">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                          msg.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white border text-gray-800"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 border-t bg-white rounded-b-2xl">
                  <input
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition"
                    onClick={handleSend}
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>        
      </div>
    </ParentLayout>
  );
}
