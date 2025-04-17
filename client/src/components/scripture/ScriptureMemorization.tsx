import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, PlusCircle, Brain, AudioLines } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ScriptureMemorization: React.FC = () => {
  const [verse, setVerse] = useState("");
  const [note, setNote] = useState("");
  const [submittedVerses, setSubmittedVerses] = useState<string[]>([]);

  const handleSubmit = () => {
    if (verse.trim()) {
      setSubmittedVerses([...submittedVerses, verse]);
      setVerse("");
      setNote("");
    }
  };

  return (
    <div className="relative min-h-screen bg-[url('/images/kidbiblebg.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-white/70 dark:bg-muted/70 backdrop-blur-md z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-8">
        <Card className="bg-white/90 dark:bg-muted/90 rounded-3xl shadow-xl border border-muted">
          <CardContent className="p-8 text-center space-y-6">
            <h2 className="text-2xl font-extrabold text-primary">Scripture Memorization Challenge</h2>
            <p className="text-muted-foreground text-md">
              Memorize Bible verses, earn rewards, and grow closer to God's Word!
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <label className="font-semibold text-sm text-muted-foreground">Verse to Memorize</label>
                <Input
                  placeholder="e.g., John 3:16"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                />
                <label className="font-semibold text-sm text-muted-foreground">Notes or Meaning</label>
                <Textarea
                  placeholder="Write what this verse means to you..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button onClick={handleSubmit} className="w-full mt-2">
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Verse
                </Button>
              </div>
              <div className="space-y-4">
                <label className="font-semibold text-sm text-muted-foreground">Your Memorized Verses</label>
                <ul className="bg-muted/20 rounded-md p-4 max-h-52 overflow-y-auto">
                  {submittedVerses.length ? (
                    submittedVerses.map((v, idx) => (
                      <li key={idx} className="mb-2 flex items-start gap-2">
                        <Star className="text-yellow-500 w-4 h-4 mt-1" />
                        <span className="text-sm font-medium">{v}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No verses yet. Add your first one!</p>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-muted/90 rounded-3xl shadow-xl border border-muted">
          <CardContent className="p-6 space-y-4 text-center">
            <h3 className="text-xl font-bold text-primary">Memory Booster & Audio Aid</h3>
            <p className="text-muted-foreground text-sm">
              Tap the audio button to hear your verse read aloud or practice it out loud with our speaking coach.
            </p>
            <div className="flex justify-center gap-6 mt-4">
              <Button variant="secondary">
                <AudioLines className="w-5 h-5 mr-2" /> Play Audio
              </Button>
              <Button variant="outline">
                <Brain className="w-5 h-5 mr-2" /> Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScriptureMemorization;