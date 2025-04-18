// client/src/components/scripture/BibleReader.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";

interface BibleVersion {
  id: string;
  name: string;
}

const bibleBookChapters: Record<string, { name: string; chapters: number }> = {
  GEN: { name: "Genesis", chapters: 50 }, EXO: { name: "Exodus", chapters: 40 }, LEV: { name: "Leviticus", chapters: 27 },
  NUM: { name: "Numbers", chapters: 36 }, DEU: { name: "Deuteronomy", chapters: 34 }, JOS: { name: "Joshua", chapters: 24 },
  // ... rest of the books
  REV: { name: "Revelation", chapters: 22 }
};

const BibleReader: React.FC = () => {
  const [bibleId, setBibleId] = useState("de4e12af7f28f599-02");
  const [book, setBook] = useState("GEN");
  const [chapter, setChapter] = useState("1");
  const [verse, setVerse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null);

  const { theme } = useTheme();
  const { currentUser } = useUser();

  const passage = verse ? `${book}.${chapter}.${verse}` : `${book}.${chapter}`;
  const selectedBookChapters = bibleBookChapters[book]?.chapters || 50;

  const { data: bibleVersionsData = { versions: [] } } = useQuery({
    queryKey: ["bibleVersions"],
    queryFn: async () => {
      const res = await fetch("/api/bible/versions");
      return res.json();
    },
  });

  const { data: verseData, isLoading, error } = useQuery({
    queryKey: ["bibleVerse", bibleId, passage],
    queryFn: async () => {
      const res = await fetch(`/api/bible/verse?bibleId=${bibleId}&passage=${encodeURIComponent(passage)}`);
      const data = await res.json();
      return data?.data?.content || "Verse not found.";
    },
    enabled: !!bibleId && !!book && !!chapter,
  });

  const getBackgroundImage = () => {
    const isChild = currentUser?.role === "child" || !currentUser?.isParent;
    if (theme === "dark") {
      return isChild ? "url('/images/kidbiblebg1_darkmode.png')" : "url('/images/parent_darkmode.png')";
    } else {
      return isChild ? "url('/images/kidbiblebg1.png')" : "url('/images/parent_lightmode.png')";
    }
  };

  const speakText = (html: string) => {
    const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
    setSpeechInstance(utterance);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleSpeech = () => {
    if (isSpeaking) stopSpeaking();
    else if (verseData) speakText(verseData);
  };

  return (
    <div
      className="absolute inset-0 z-0 bg-cover bg-center opacity-90 dark:opacity-80 ml-20 mt-20"
      style={{ backgroundImage: getBackgroundImage(), backgroundRepeat: "no-repeat" }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-8 space-y-8">
        <Card className="rounded-2xl shadow-lg border border-muted">
          <CardContent className="p-4 grid md:grid-cols-4 gap-4">
            {/* Version */}
            <div>
              <label className="block text-sm font-semibold mb-1">Version</label>
              <Select value={bibleId} onValueChange={setBibleId}>
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="Select Version" />
                </SelectTrigger>
                <SelectContent>
                  {bibleVersionsData.versions.map((version: BibleVersion) => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Book */}
            <div>
              <label className="block text-sm font-semibold mb-1">Book</label>
              <Select value={book} onValueChange={setBook}>
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="Select Book" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(bibleBookChapters).map(([id, { name }]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chapter */}
            <div>
              <label className="block text-sm font-semibold mb-1">Chapter</label>
              <Select value={chapter} onValueChange={setChapter}>
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: selectedBookChapters }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Chapter {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Verse */}
            <div>
              <label className="block text-sm font-semibold mb-1">Verse</label>
              <Select value={verse || "0"} onValueChange={(val) => setVerse(val === "0" ? "" : val)}>
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="Whole Chapter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Whole Chapter</SelectItem>
                  {Array.from({ length: 50 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Verse {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Scripture Output */}
        <Card className="w-full rounded-3xl shadow-xl border border-muted bg-white/90 dark:bg-muted/90">
          <CardContent className="p-6 overflow-y-auto rounded-xl relative" style={{ maxHeight: "calc(100vh - 380px)", margin: "1rem" }}>
            {/* TTS Controls */}
            <div className="absolute top-4 right-6 space-x-2 z-20">
              <button
                onClick={toggleSpeech}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-full text-sm"
              >
                {isSpeaking ? "Pause" : "Read"}
              </button>
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-full text-sm"
                >
                  Stop
                </button>
              )}
            </div>

            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : error ? (
              <p className="text-red-500">Error loading scripture.</p>
            ) : (
              <div
                className="prose dark:prose-invert max-w-none text-xl leading-relaxed tracking-wide"
                dangerouslySetInnerHTML={{
                  __html: verseData.replace(
                    /<sup>(\d+)<\/sup>/g,
                    '<sup class="text-cyan-400 font-extrabold text-xl tracking-widest not-prose whitespace-nowrap mr-1">$1</sup>'
                  ),
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BibleReader;
