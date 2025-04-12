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

const allBooks = [
  { id: "GEN", name: "Genesis", chapters: 50 }, { id: "EXO", name: "Exodus", chapters: 40 }, { id: "LEV", name: "Leviticus", chapters: 27 },
  { id: "NUM", name: "Numbers", chapters: 36 }, { id: "DEU", name: "Deuteronomy", chapters: 34 }, { id: "JOS", name: "Joshua", chapters: 24 },
  { id: "JDG", name: "Judges", chapters: 21 }, { id: "RUT", name: "Ruth", chapters: 4 }, { id: "1SA", name: "1 Samuel", chapters: 31 },
  { id: "2SA", name: "2 Samuel", chapters: 24 }, { id: "1KI", name: "1 Kings", chapters: 22 }, { id: "2KI", name: "2 Kings", chapters: 25 },
  { id: "1CH", name: "1 Chronicles", chapters: 29 }, { id: "2CH", name: "2 Chronicles", chapters: 36 }, { id: "EZR", name: "Ezra", chapters: 10 },
  { id: "NEH", name: "Nehemiah", chapters: 13 }, { id: "EST", name: "Esther", chapters: 10 }, { id: "JOB", name: "Job", chapters: 42 },
  { id: "PSA", name: "Psalms", chapters: 150 }, { id: "PRO", name: "Proverbs", chapters: 31 }, { id: "ECC", name: "Ecclesiastes", chapters: 12 },
  { id: "SNG", name: "Song of Solomon", chapters: 8 }, { id: "ISA", name: "Isaiah", chapters: 66 }, { id: "JER", name: "Jeremiah", chapters: 52 },
  { id: "LAM", name: "Lamentations", chapters: 5 }, { id: "EZK", name: "Ezekiel", chapters: 48 }, { id: "DAN", name: "Daniel", chapters: 12 },
  { id: "HOS", name: "Hosea", chapters: 14 }, { id: "JOL", name: "Joel", chapters: 3 }, { id: "AMO", name: "Amos", chapters: 9 },
  { id: "OBA", name: "Obadiah", chapters: 1 }, { id: "JON", name: "Jonah", chapters: 4 }, { id: "MIC", name: "Micah", chapters: 7 },
  { id: "NAM", name: "Nahum", chapters: 3 }, { id: "HAB", name: "Habakkuk", chapters: 3 }, { id: "ZEP", name: "Zephaniah", chapters: 3 },
  { id: "HAG", name: "Haggai", chapters: 2 }, { id: "ZEC", name: "Zechariah", chapters: 14 }, { id: "MAL", name: "Malachi", chapters: 4 },
  { id: "MAT", name: "Matthew", chapters: 28 }, { id: "MRK", name: "Mark", chapters: 16 }, { id: "LUK", name: "Luke", chapters: 24 },
  { id: "JHN", name: "John", chapters: 21 }, { id: "ACT", name: "Acts", chapters: 28 }, { id: "ROM", name: "Romans", chapters: 16 },
  { id: "1CO", name: "1 Corinthians", chapters: 16 }, { id: "2CO", name: "2 Corinthians", chapters: 13 }, { id: "GAL", name: "Galatians", chapters: 6 },
  { id: "EPH", name: "Ephesians", chapters: 6 }, { id: "PHP", name: "Philippians", chapters: 4 }, { id: "COL", name: "Colossians", chapters: 4 },
  { id: "1TH", name: "1 Thessalonians", chapters: 5 }, { id: "2TH", name: "2 Thessalonians", chapters: 3 }, { id: "1TI", name: "1 Timothy", chapters: 6 },
  { id: "2TI", name: "2 Timothy", chapters: 4 }, { id: "TIT", name: "Titus", chapters: 3 }, { id: "PHM", name: "Philemon", chapters: 1 },
  { id: "HEB", name: "Hebrews", chapters: 13 }, { id: "JAS", name: "James", chapters: 5 }, { id: "1PE", name: "1 Peter", chapters: 5 },
  { id: "2PE", name: "2 Peter", chapters: 3 }, { id: "1JN", name: "1 John", chapters: 5 }, { id: "2JN", name: "2 John", chapters: 1 },
  { id: "3JN", name: "3 John", chapters: 1 }, { id: "JUD", name: "Jude", chapters: 1 }, { id: "REV", name: "Revelation", chapters: 22 },
];

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
      const res = await fetch(`/api/bible-verse?bibleId=${bibleId}&passage=${encodeURIComponent(passage)}`);
      const data = await res.json();
      return data?.data?.content || "Verse not found.";
    },
    enabled: !!bibleId && !!book && !!chapter,
  });

  const selectedBookChapters = allBooks.find((b) => b.id === book)?.chapters || 50;

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-muted/90 shadow-md rounded-2xl border border-gray-200 dark:border-muted px-4 py-6">
        <CardContent className="grid gap-6 md:grid-cols-4">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">Version</label>
            <Select value={bibleId} onValueChange={setBibleId}>
              <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-muted text-sm shadow-sm">
                <SelectValue placeholder="Select a version" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-muted border border-muted rounded-xl">
                {bibleVersionsData.versions.map((version: BibleVersion) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">Book</label>
            <Select value={book} onValueChange={setBook}>
              <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-muted text-sm shadow-sm">
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-muted border border-muted rounded-xl">
                {allBooks.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">Chapter</label>
            <Select value={chapter} onValueChange={setChapter}>
              <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-muted text-sm shadow-sm">
                <SelectValue placeholder="Select a chapter" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-muted border border-muted rounded-xl">
                {Array.from({ length: selectedBookChapters }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Chapter {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1">Verse</label>
            <Select value={verse || "0"} onValueChange={(val) => setVerse(val === "0" ? "" : val)}>
              <SelectTrigger className="w-full rounded-xl border-gray-300 dark:border-muted text-sm shadow-sm">
                <SelectValue placeholder="Whole Chapter" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-muted border border-muted rounded-xl">
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

      <Card>
        <CardContent className="p-6">
          {contentLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : error ? (
            <p className="text-red-500">Error loading scripture.</p>
          ) : (
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: verseData }} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BibleReader;