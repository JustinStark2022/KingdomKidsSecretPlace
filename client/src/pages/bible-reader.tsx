import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import ParentLayout from "@/components/layout/parent-layout";
import ChildLayout from "@/components/layout/child-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BookOpen, Volume2, Loader2 } from "lucide-react";

export default function BibleReader() {
  const { user } = useAuth();
  const isChild = user?.role === "child";
  const Layout = isChild ? ChildLayout : ParentLayout;

  const [bibleId, setBibleId] = useState("de4e12af7f28f599-02");
  const [book, setBook] = useState("GEN");
  const [chapter, setChapter] = useState("1");
  const [verse, setVerse] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const passage = verse ? `${book}.${chapter}.${verse}` : `${book}.${chapter}`;

  const {
    data: bibleVersionsData = { versions: [] },
    isLoading: versionsLoading,
  } = useQuery({
    queryKey: ["bibleVersions"],
    queryFn: async () => {
      const res = await fetch("/api/bible/bibles");
      const json = await res.json();
      return { versions: json.data.map((v: any) => ({ id: v.id, name: v.name || v.abbreviation })) };
    },
  });

  const { data: verseData, isLoading: contentLoading, error } = useQuery({
    queryKey: ["bibleVerse", bibleId, passage],
    queryFn: async () => {
      const res = await fetch(`/api/bible/bibles/${bibleId}/passages/${encodeURIComponent(passage)}?content-type=text.html`);
      const json = await res.json();
      return json?.data?.content || "Verse not found.";
    },
    enabled: !!bibleId && !!book && !!chapter,
  });

  const selectedBookChapters = {
    GEN: 50, EXO: 40, LEV: 27, NUM: 36, DEU: 34, JOS: 24, JDG: 21, RUT: 4,
    "1SA": 31, "2SA": 24, "1KI": 22, "2KI": 25, "1CH": 29, "2CH": 36, EZR: 10,
    NEH: 13, EST: 10, JOB: 42, PSA: 150, PRO: 31, ECC: 12, SNG: 8, ISA: 66,
    JER: 52, LAM: 5, EZK: 48, DAN: 12, HOS: 14, JOL: 3, AMO: 9, OBA: 1, JON: 4,
    MIC: 7, NAM: 3, HAB: 3, ZEP: 3, HAG: 2, ZEC: 14, MAL: 4, MAT: 28, MRK: 16,
    LUK: 24, JHN: 21, ACT: 28, ROM: 16, "1CO": 16, "2CO": 13, GAL: 6, EPH: 6,
    PHP: 4, COL: 4, "1TH": 5, "2TH": 3, "1TI": 6, "2TI": 4, TIT: 3, PHM: 1,
    HEB: 13, JAS: 5, "1PE": 5, "2PE": 3, "1JN": 5, "2JN": 1, "3JN": 1, JUD: 1, REV: 22,
  }[book] || 50;

  const parseHTML = (html: string): string[] => {
    if (!html) return [];
    const container = document.createElement("div");
    container.innerHTML = html;
    const spans = container.querySelectorAll("span.verse");
    return Array.from(spans).map((span) => span.textContent || "");
  };

  const isWholeChapter = verse === "";
  const parsedVerses = isWholeChapter ? parseHTML(verseData as string) : [];
  const singleVerse = !isWholeChapter ? (verseData as string) : "";

  const playTTS = () => {
    const lines = isWholeChapter ? parsedVerses : [singleVerse];
    let index = 0;

    const speak = (idx: number) => {
      if (!lines[idx]) {
        setIsPlaying(false);
        setHighlightIndex(null);
        return;
      }
      setHighlightIndex(idx);
      const utter = new SpeechSynthesisUtterance(lines[idx]);
      utter.onend = () => speak(idx + 1);
      utter.onerror = () => speak(idx + 1);
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    };

    setIsPlaying(true);
    speak(0);
  };

  const stopTTS = () => {
    setIsPlaying(false);
    setHighlightIndex(null);
    window.speechSynthesis.cancel();
  };

  return (
    <Layout title="Bible Reader">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="bg-primary-100 dark:bg-primary-900/20 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-primary-800 dark:text-primary-200">
              <BookOpen className="w-5 h-5" /> Bible Reader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block mb-1 font-medium">Version</label>
                <Select value={bibleId} onValueChange={setBibleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                  {bibleVersionsData.versions.map((v: { id: string; name: string }) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Book</label>
                <Select value={book} onValueChange={setBook}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(selectedBookChapters).map(([abbr, chapters]) => (
                      <SelectItem key={abbr} value={abbr}>
                        {abbr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Chapter</label>
                <Select value={chapter} onValueChange={setChapter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
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

              <div>
                <label className="block mb-1 font-medium">Verse</label>
                <Select value={verse || "0"} onValueChange={(val) => setVerse(val === "0" ? "" : val)}>
                  <SelectTrigger>
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
            </div>

            <div className="mb-4">
              <Button onClick={isPlaying ? stopTTS : playTTS} disabled={isWholeChapter ? parsedVerses.length === 0 : !singleVerse}>
                <Volume2 className="w-4 h-4 mr-2" />
                {isPlaying ? "Stop" : "Play"}
              </Button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg min-h-[200px] space-y-2">
              {contentLoading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin mr-2" /> Loading scripture...
                </div>
              ) : error ? (
                <p className="text-red-500">Error loading scripture.</p>
              ) : isWholeChapter ? (
                parsedVerses.map((line, idx) => (
                  <div key={idx} className={highlightIndex === idx ? "bg-yellow-200 dark:bg-yellow-600/40 px-2 rounded" : ""}>
                    {line}
                  </div>
                ))
              ) : (
                <div className={highlightIndex === 0 ? "bg-yellow-200 dark:bg-yellow-600/40 px-2 rounded" : ""}>
                  {singleVerse}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
