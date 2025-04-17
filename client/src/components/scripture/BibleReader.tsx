import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface BibleVersion {
  id: string;
  name: string;
}

const BibleReader: React.FC = () => {
  const [bibleId, setBibleId] = useState("de4e12af7f28f599-02");
  const [book, setBook] = useState("GEN");
  const [chapter, setChapter] = useState("1");
  const [verse, setVerse] = useState("");

  const passage = verse ? `${book}.${chapter}.${verse}` : `${book}.${chapter}`;

  const { data: bibleVersionsData = { versions: [] }, isLoading: versionsLoading } = useQuery({
    queryKey: ["bibleVersions"],
    queryFn: async () => {
      const res = await fetch("/api/bible/versions");
      return res.json();
    },
  });

  const { data: verseData, isLoading: contentLoading, error } = useQuery({
    queryKey: ["bibleVerse", bibleId, passage],
    queryFn: async () => {
      const res = await fetch(`/api/bible/verse?bibleId=${bibleId}&passage=${encodeURIComponent(passage)}`);
      const data = await res.json();
      return data?.data?.content || "Verse not found.";
    },
    enabled: !!bibleId && !!book && !!chapter,
  });

  const selectedBookChapters = {
    GEN: 50,
    EXO: 40,
    LEV: 27,
    NUM: 36,
    DEU: 34,
    // Add more as needed
  }[book] || 50;

  return (
    <div className="absolute  inset-0 z-0 bg-cover bg-center opacity-90  dark:opacity-80 ml-20  mt-20"
      style={{
        backgroundImage: "url('/images/kidbiblebg1.png')",
        backgroundRepeat: "no-repeat",
        
      }}
    >
      

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-8 space-y-8">
        {/* Bible Selector Dropdowns */}
        <Card className="rounded-2xl shadow-lg border border-muted">
          <CardContent className="p-4 grid md:grid-cols-4 gap-4">
            {/* Version */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1">Version</label>
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
              <label className="block text-sm font-semibold text-muted-foreground mb-1">Book</label>
              <Select value={book} onValueChange={setBook}>
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="Select Book" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { id: "GEN", name: "Genesis" }, { id: "EXO", name: "Exodus" }, { id: "LEV", name: "Leviticus" },
                    { id: "NUM", name: "Numbers" }, { id: "DEU", name: "Deuteronomy" }, { id: "JOS", name: "Joshua" },
                    { id: "JDG", name: "Judges" }, { id: "RUT", name: "Ruth" }, { id: "1SA", name: "1 Samuel" },
                    { id: "2SA", name: "2 Samuel" }, { id: "1KI", name: "1 Kings" }, { id: "2KI", name: "2 Kings" },
                    { id: "1CH", name: "1 Chronicles" }, { id: "2CH", name: "2 Chronicles" }, { id: "EZR", name: "Ezra" },
                    { id: "NEH", name: "Nehemiah" }, { id: "EST", name: "Esther" }, { id: "JOB", name: "Job" },
                    { id: "PSA", name: "Psalms" }, { id: "PRO", name: "Proverbs" }, { id: "ECC", name: "Ecclesiastes" },
                    { id: "SNG", name: "Song of Solomon" }, { id: "ISA", name: "Isaiah" }, { id: "JER", name: "Jeremiah" },
                    { id: "LAM", name: "Lamentations" }, { id: "EZK", name: "Ezekiel" }, { id: "DAN", name: "Daniel" },
                    { id: "HOS", name: "Hosea" }, { id: "JOL", name: "Joel" }, { id: "AMO", name: "Amos" },
                    { id: "OBA", name: "Obadiah" }, { id: "JON", name: "Jonah" }, { id: "MIC", name: "Micah" },
                    { id: "NAM", name: "Nahum" }, { id: "HAB", name: "Habakkuk" }, { id: "ZEP", name: "Zephaniah" },
                    { id: "HAG", name: "Haggai" }, { id: "ZEC", name: "Zechariah" }, { id: "MAL", name: "Malachi" },
                    { id: "MAT", name: "Matthew" }, { id: "MRK", name: "Mark" }, { id: "LUK", name: "Luke" },
                    { id: "JHN", name: "John" }, { id: "ACT", name: "Acts" }, { id: "ROM", name: "Romans" },
                    { id: "1CO", name: "1 Corinthians" }, { id: "2CO", name: "2 Corinthians" }, { id: "GAL", name: "Galatians" },
                    { id: "EPH", name: "Ephesians" }, { id: "PHP", name: "Philippians" }, { id: "COL", name: "Colossians" },
                    { id: "1TH", name: "1 Thessalonians" }, { id: "2TH", name: "2 Thessalonians" }, { id: "1TI", name: "1 Timothy" },
                    { id: "2TI", name: "2 Timothy" }, { id: "TIT", name: "Titus" }, { id: "PHM", name: "Philemon" },
                    { id: "HEB", name: "Hebrews" }, { id: "JAS", name: "James" }, { id: "1PE", name: "1 Peter" },
                    { id: "2PE", name: "2 Peter" }, { id: "1JN", name: "1 John" }, { id: "2JN", name: "2 John" },
                    { id: "3JN", name: "3 John" }, { id: "JUD", name: "Jude" }, { id: "REV", name: "Revelation" },
                  ].map(({ id, name }) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chapter */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1">Chapter</label>
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
              <label className="block text-sm font-semibold text-muted-foreground mb-1">Verse</label>
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

        {/* Scripture Output Scrollable Card */}
        <Card className="w-full rounded-3xl shadow-xl border border-muted bg-white/90 dark:bg-muted/90">
          <CardContent
            className="p-6 overflow-y-auto rounded-xl"
            style={{
              maxHeight: "calc(100vh - 380px)",
              paddingBottom: "1rem",
              margin: "1rem",
            }}
          >
            {contentLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : error ? (
              <p className="text-red-500">Error loading scripture.</p>
            ) : (
              <div
                className="prose dark:prose-invert max-w-none text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: verseData }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BibleReader;
