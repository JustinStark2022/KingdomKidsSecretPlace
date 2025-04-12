import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameAnalysis from "@/components/monitoring/GameAnalysis";
import ChatMonitoring from "@/components/monitoring/ChatMonitoring";
import ScreenTimeControls from "@/components/monitoring/ScreenTimeControls";
import FriendRequests from "@/components/monitoring/FriendRequests";
import {
  Shield,
  MessageSquare,
  Clock,
  Users,
  Activity
} from "lucide-react";

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className=" pl-7 pt-7 text-5xl font-bold mb-2">
          <span className="text-primary neon-text">Kingdom Control Hub</span>
        </h1>
        <p className=" pl-7 text-2xl font-bold text-muted-foreground">
          Customize content filtering &amp; real-time alerts to fit your needs.
        </p>
      </div>

      {/* Tabs */}
      <Tabs className="mb-6 pl-4 " defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 ">
          <TabsTrigger value="dashboard">
            <Activity className="mr-2 h-4 w-4" />
            Pending Alerts
          </TabsTrigger>
          <TabsTrigger value="games">
            <Shield className="mr-2 h-4 w-4" />
            Game Analysis
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat Monitoring
          </TabsTrigger>
          <TabsTrigger value="screen-time">
            <Clock className="mr-2 h-4 w-4" />
            Screen Time
          </TabsTrigger>
          <TabsTrigger value="friends">
            <Users className="mr-2 h-4 w-4" />
            Friend Requests
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab Content */}
        <TabsContent value="dashboard">
          <div className=" pl-4 pr-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Game Analysis Card */}
            <Card
              className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
              onClick={() => setActiveTab("games")}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-primary/20 p-4">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Game Approval Request</h3>
                <p className="text-muted-foreground mb-4">
                  Review game content &amp; approve or block access
                </p>
                <Button onClick={() => setActiveTab("games")}>
                  Game Summary
                </Button>
              </CardContent>
            </Card>

            {/* Chat Monitoring Card */}
            <Card
              className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
              onClick={() => setActiveTab("chat")}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-primary/20 p-4">
                    <MessageSquare className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Red Flag Alert</h3>
                <p className="text-muted-foreground mb-4">
                  Red Flag Triggered NEEDS ATTENTION
                </p>
                <Button onClick={() => setActiveTab("chat")}>
                  View Alert
                </Button>
              </CardContent>
            </Card>

            {/* Screen Time Controls Card */}
            <Card
              className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
              onClick={() => setActiveTab("screen-time")}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-primary/20 p-4">
                    <Clock className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Screen Time Schedule</h3>
                <p className="text-muted-foreground mb-4">
                  Set limits &amp; create healthy screen time schedules
                </p>
                <Button onClick={() => setActiveTab("screen-time")}>
                  Manage Screen Time
                </Button>
              </CardContent>
            </Card>

            {/* Friend Requests Card */}
            <Card
              className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
              onClick={() => setActiveTab("friends")}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-primary/20 p-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Achievement Alert</h3>
                <p className="text-muted-foreground mb-4">
                  Bible Lessons &amp; scriptures mastered.
                </p>
                <Button onClick={() => setActiveTab("friends")}>
                  See Achievements
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started Section */}
          <div className="mt-8">
            <h2 className="text-xl pl-4 font-bold mb-4">Kingdom Kids Family Discipleship Hub</h2>
            <Card>
            <CardContent className="p-6 space-y-4">
              <p>
                A place to monitor your child’s digital world, but also nurture meaningful conversations about faith, character, &amp; what it means to follow Jesus in this digital age.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    Guarding Our Hearts Online
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Discussion:</strong> How can we honor God with what we see, hear, &amp; play online? Read <em>Proverbs 4:23</em> — "Above all else, guard your heart, for everything you do flows from it." Talk about how to choose media that builds faith and reflects God's love.
                  </p>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Clock className="h-5 w-5 text-primary mr-2" />
                    Making Time Count
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Discussion:</strong> What does it mean to be a good steward of our time? Read <em>Ephesians 5:15-16</em> — “Be very careful... making the most of every opportunity.” Use this to discuss healthy screen time and making room for prayer, play, and rest.
                  </p>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <MessageSquare className="h-5 w-5 text-primary mr-2" />
                    Speaking Life Online
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Discussion:</strong> Are our words online kind &amp; Christlike? Read <em>Ephesians 4:29</em> — "Do not let any unwholesome talk come out of your mouths…" Ask: How can we be encouraging even in digital spaces?
                  </p>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    Choosing Godly Friends
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Discussion:</strong> What kind of friends help us grow closer to Jesus? Read <em>1 Corinthians 15:33</em> — “Bad company corrupts good character.” Discuss how to recognize friends that lift us up &amp; honor our values.
                  </p>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Individual Tab Views */}
        <TabsContent value="games">
          <GameAnalysis />
        </TabsContent>
        <TabsContent value="chat">
          <ChatMonitoring />
        </TabsContent>
        <TabsContent value="screen-time">
          <ScreenTimeControls />
        </TabsContent>
        <TabsContent value="friends">
          <FriendRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentDashboard;
