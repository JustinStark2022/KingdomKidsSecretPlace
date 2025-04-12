import React from "react";
import PrayerJournal from "@/components/scripture/PrayerJournal";

const Prayer: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-primary neon-text">Prayer</span> Journal
        </h1>
        <p className="text-muted-foreground">Keep track of your prayers and conversations with God</p>
      </div>
      
      <PrayerJournal />
    </div>
  );
};

export default Prayer;
