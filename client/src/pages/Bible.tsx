// client/src/pages/Bible.tsx
import React from "react";
import BibleReader from "@/components/scripture/BibleReader";

const Bible: React.FC = () => {
  return (
    <div className="space-y-6">
      <BibleReader />
    </div>
  );
};

export default Bible;