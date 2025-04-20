import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { BookOpenCheck, SendHorizonal } from "lucide-react";

const PrayerJournal: React.FC = () => {
  const [prayer, setPrayer] = useState("");
  const [prayers, setPrayers] = useState<string[]>([]);

  const handleSubmit = () => {
    if (prayer.trim()) {
      setPrayers([prayer, ...prayers]);
      setPrayer("");
    }
  };

  return (
    <div className="relative min-h-screen  ">
      {/* Background image layer */}
      <div
        className="absolute  -top-40 inset-0 z-0 bg-cover  bg-center bg-no-repeat opacity-90 dark:opacity-80"
        style={{
          backgroundImage: "url('/images/prayerjournalbg1.png')",
        }}
      />
      <div className="absolute inset-0 bg-white/20 dark:bg-black/20  z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 space-y-8">
        <Card className=" card   dark:bg-black/70 rounded-3xl shadow-xl border ">
          <CardContent className="p-8 text-center space-y-6">
            <h2 className=" text-2xl font-extrabold text-primary">My Prayer Journal</h2>
            <p className="text-muted-foreground text-md">
              Write your prayers and keep track of your conversations with God.
            </p>
            <Textarea 
              className="mt-4 card  dark:bg-black/35 "
              placeholder="Dear God..."
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              rows={6}
            />
            <Button onClick={handleSubmit} className="mt-4">
              <SendHorizonal className="h-4 w-4 mr-2" /> Submit Prayer
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-muted/90 rounded-3xl shadow-xl border border-muted">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5" /> Prayer History
            </h3>
            <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {prayers.length ? (
                prayers.map((entry, idx) => (
                  <li
                    key={idx}
                    className="bg-muted/40 rounded-xl p-3 text-sm text-muted-foreground shadow-sm"
                  >
                    {entry}
                  </li>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">Your prayer journal is empty.</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrayerJournal;
