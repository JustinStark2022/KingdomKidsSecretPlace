import React, { useState } from "react";
import { Card, CardContent, Button } from "@/components/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Trophy, Sparkles, Activity, Clock, MessageSquare, Users } from "lucide-react";

const ChildDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/images/childdashboardbg.png')" }}
    >
      <div>
        <h1 className="pl-6 pt-4 text-5xl font-bold mb-2">
          <span className="text-primary logo-outline neon-text">My Secret Place</span>
        </h1>
        <p className="pl-6 text-2xl dark:text-white font-bold logo-outline">
          Where Kingdom Kids grow in faith & fun! ✨
        </p>
      </div>

      <Tabs
        className="mb-6 pl-0 ml-6 mr-2"
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6 pl-2">
          <TabsTrigger value="dashboard">
            <Activity className="mr-2 h-4 w-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="devotional">
            <BookOpen className="mr-2 h-4 w-4" /> Devotionals
          </TabsTrigger>
          <TabsTrigger value="games">
            <Trophy className="mr-2 h-4 w-4" /> Game Time
          </TabsTrigger>
          <TabsTrigger value="verses">
            <Sparkles className="mr-2 h-4 w-4" /> Memory Verses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-2">
            {/* Devotional Preview */}
            <Card className="cursor-pointer hover:shadow-lg hover:border-primary transition-all" onClick={() => setActiveTab("devotional")}> 
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-blue-100 p-4">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Today's Devotional</h3>
                <p className="text-sm text-muted-foreground">Psalm 139:14 💖</p>
              </CardContent>
            </Card>

            {/* Game Progress */}
            <Card className="cursor-pointer hover:shadow-lg hover:border-primary transition-all" onClick={() => setActiveTab("games")}> 
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-yellow-100 p-4">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Game Stars</h3>
                <p className="text-sm text-muted-foreground">⭐ Complete Bible challenges to earn stars</p>
              </CardContent>
            </Card>

            {/* Memory Verses */}
            <Card className="cursor-pointer hover:shadow-lg hover:border-primary transition-all" onClick={() => setActiveTab("verses")}> 
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-purple-100 p-4">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Memory Verses</h3>
                <p className="text-sm text-muted-foreground">Review scriptures & unlock badges 📖</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devotional">
          <Card className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-primary mb-4">Devotional of the Day</h2>
              <p className="text-muted-foreground">
                "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well." – Psalm 139:14
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games">
          <Card className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-yellow-600 mb-4">Game Challenge Center</h2>
              <p className="text-muted-foreground mb-2">🎯 You’ve earned 4 out of 10 stars!</p>
              <div className="w-full bg-yellow-100 rounded-full h-4">
                <div className="bg-yellow-500 h-4 rounded-full w-2/5"></div>
              </div>
              <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white">Start Challenge</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verses">
          <Card className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">Your Memory Verses</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>John 3:16 – For God so loved the world…</li>
                <li>Psalm 23:1 – The Lord is my Shepherd…</li>
                <li>Proverbs 3:5 – Trust in the Lord…</li>
              </ul>
              <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white">Review All</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChildDashboard;