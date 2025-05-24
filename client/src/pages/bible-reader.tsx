import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

interface Book {
  id: string;
  name: string;
  abbreviation: string;
}

interface BibleVersion {
  id: string;
  name: string;
}

interface Chapter {
  id: string; // e.g., "GEN.1"
  number: string; // e.g., "1"
}

export default function BibleReader() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isChild = user?.role === "child";
  const Layout = isChild ? ChildLayout : ParentLayout;

  const [bibleId, setBibleId] = useState("de4e12af7f28f599-02"); // Default NIrV
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState("GEN"); // Default Genesis
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapter, setChapter] = useState("1"); // This will store the selected chapter *number*
  const [verseCount, setVerseCount] = useState(0);
  const [verse, setVerse] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const passage = verse ? `${selectedBookId}.${chapter}.${verse}` : `${selectedBookId}.${chapter}`;

  const {
    data: bibleVersionsData = { versions: [] },
    isLoading: versionsLoading,
  } = useQuery<{ versions: BibleVersion[] }>({
    queryKey: ["bibleVersions"],
    queryFn: async () => {
      const res = await fetch("/api/bible/bibles");
      if (!res.ok) throw new Error("Failed to fetch Bible versions");
      const json = await res.json();
      return { versions: json.data?.map((v: any) => ({ id: v.id, name: v.name || v.abbreviation })) || [] };
    },
  });

  const {
    data: booksData,
    isLoading: booksLoading,
    isError: booksError,
  } = useQuery<{ data: Book[] }>({
    queryKey: ['bibleBooks', bibleId],
    queryFn: async () => {
      const res = await fetch(`/api/bible/bibles/${bibleId}/books`);
      if (!res.ok) throw new Error(`Failed to fetch books for Bible ID ${bibleId}`);
      return res.json();
    },
    enabled: !!bibleId,
    onSuccess: (data) => {
      const fetchedBooks = data?.data || [];
      setBooks(fetchedBooks);
      setChapters([]); // Clear previous chapters
      if (fetchedBooks.length > 0) {
        const firstBookId = fetchedBooks[0].id;
        setSelectedBookId(firstBookId);
        // Chapter will be set by the bibleChapters query's onSuccess
        // setChapter("1"); // No longer set here directly
        setVerse("");
        queryClient.invalidateQueries({ queryKey: ["bibleChapters", bibleId, firstBookId] });
        queryClient.invalidateQueries({ queryKey: ["bibleVerse"] });
      } else {
        setSelectedBookId("");
        setChapter(""); // Clear chapter if no books
        setVerse("");
      }
    },
  });

  const {
    data: chaptersData,
    isLoading: chaptersLoading,
    isError: chaptersError,
  } = useQuery<{ data: Chapter[] }>({
    queryKey: ['bibleChapters', bibleId, selectedBookId],
    queryFn: async () => {
      const res = await fetch(`/api/bible/bibles/${bibleId}/books/${selectedBookId}/chapters`);
      if (!res.ok) throw new Error(`Failed to fetch chapters for book ${selectedBookId}`);
      return res.json();
    },
    enabled: !!bibleId && !!selectedBookId,
    onSuccess: (data) => {
      const fetchedChapters = data?.data || [];
      setChapters(fetchedChapters);
      setVerseCount(0); // Reset verse count when chapter changes, before new one is fetched
      if (fetchedChapters.length > 0) {
        const firstChapterNumber = fetchedChapters[0].number;
        setChapter(firstChapterNumber);
        setVerse(""); // Default to whole chapter
        // No need to invalidate bibleVerse here, verseCountQuery's onSuccess will do it.
        // queryClient.invalidateQueries({ queryKey: ["verseCount", bibleId, selectedBookId, firstChapterNumber] }); // auto-triggers
      } else {
        setChapter("");
        setVerse("");
      }
    },
  });

  const {
    data: verseCountData,
    isLoading: verseCountLoading,
    isError: verseCountError,
  } = useQuery<{ count: number }>({
    queryKey: ['verseCount', bibleId, selectedBookId, chapter],
    queryFn: async () => {
      const res = await fetch(`/api/bible/bibles/${bibleId}/books/${selectedBookId}/chapters/${chapter}/versecount`);
      if (!res.ok) throw new Error(`Failed to fetch verse count for ${selectedBookId} ${chapter}`);
      return res.json();
    },
    enabled: !!bibleId && !!selectedBookId && !!chapter,
    onSuccess: (data) => {
      setVerseCount(data?.count || 0);
      setVerse(""); // Default to "Whole Chapter" when new count arrives
      queryClient.invalidateQueries({ queryKey: ["bibleVerse", bibleId, selectedBookId, chapter, ""] }); // Ensure whole chapter reloads
    },
  });
  
  const { data: verseData, isLoading: contentLoading, error: verseError } = useQuery<string>({
    queryKey: ["bibleVerse", bibleId, selectedBookId, chapter, verse], // Added verse to key
    queryFn: async () => {
      const currentPassage = verse ? `${selectedBookId}.${chapter}.${verse}` : `${selectedBookId}.${chapter}`;
      const res = await fetch(`/api/bible/bibles/${bibleId}/passages/${encodeURIComponent(currentPassage)}?content-type=text.html`);
      if (!res.ok) throw new Error(`Failed to fetch passage ${currentPassage}`);
      const json = await res.json();
      return json?.data?.content || "Verse not found.";
    },
    enabled: !!bibleId && !!selectedBookId && !!chapter,
  });

  const parseHTML = (html: string): string[] => {
    if (!html) return [];
    const container = document.createElement("div");
    container.innerHTML = html;
    const spans = container.querySelectorAll("span.verse");
    return Array.from(spans).map((span) => span.textContent || "");
  };

  const isWholeChapter = verse === "";
  // Always parse verseData. If verseData is undefined or null, parseHTML returns [].
  // If it's a single verse, parseHTML will extract its content if wrapped in a .verse span,
  // or return an empty array if not. If it's plain text, it might also return empty.
  // The API for single verse does return content like <p class="p"><span class="verse" data-id="GEN.1.1">...</span></p>
  // so parseHTML should work for single verses too.
  const parsedContent = parseHTML(verseData as string || "");

  const playTTS = () => {
    const lines = parsedContent; // Use the consistently parsed content
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
                <Select
                  value={bibleId}
                  onValueChange={(newBibleId) => {
                    setBibleId(newBibleId);
                    setBooks([]);
                    setSelectedBookId("");
                    setChapters([]);
                    setChapter("");
                    setVerse("");
                    // No need to invalidate chapters query here, it will be disabled then re-enabled
                  }}
                  disabled={versionsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={versionsLoading ? "Loading versions..." : "Select version"} />
                  </SelectTrigger>
                  <SelectContent>
                  {bibleVersionsData.versions.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Book</label>
                <Select
                  value={selectedBookId}
                  onValueChange={(newBookId) => {
                    setSelectedBookId(newBookId);
                    setChapters([]); // Clear previous chapters when book changes
                    // Chapter will be set by bibleChapters query's onSuccess
                    setVerse("");
                    // queryClient.invalidateQueries({ queryKey: ["bibleChapters", bibleId, newBookId] }); // This is implicitly handled by enabled flag
                    queryClient.invalidateQueries({ queryKey: ["bibleVerse"] });
                  }}
                  disabled={booksLoading || !bibleId || booksError}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={booksLoading ? "Loading books..." : (booksError ? "Error loading" : "Select book")} />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name} ({b.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Chapter</label>
                <Select 
                  value={chapter} 
                  onValueChange={(newChapterNumber) => {
                    setChapter(newChapterNumber);
                    // Verse count will be fetched by the verseCountQuery due to 'chapter' changing.
                    // Verse state will be reset to "" in verseCountQuery's onSuccess.
                    // bibleVerse query will be invalidated in verseCountQuery's onSuccess.
                  }}
                  disabled={chaptersLoading || !selectedBookId || chaptersError}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={chaptersLoading ? "Loading chapters..." : (chaptersError ? "Error loading" : "Select chapter")} />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((chap) => (
                      <SelectItem key={chap.id} value={chap.number}>
                        Chapter {chap.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Verse</label>
                <Select
                  value={verse || "0"}
                  onValueChange={(val) => {
                    const newVerse = val === "0" ? "" : val;
                    setVerse(newVerse);
                    queryClient.invalidateQueries({ queryKey: ["bibleVerse", bibleId, selectedBookId, chapter, newVerse] });
                  }}
                  disabled={verseCountLoading || !chapter || verseCountError}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={verseCountLoading ? "Loading..." : (verseCountError ? "Error" : "Whole Chapter")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Whole Chapter</SelectItem>
                    {Array.from({ length: verseCount }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Verse {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-4">
              <Button onClick={isPlaying ? stopTTS : playTTS} disabled={parsedContent.length === 0 || contentLoading}>
                <Volume2 className="w-4 h-4 mr-2" />
                {isPlaying ? "Stop" : "Play"}
              </Button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg min-h-[200px] space-y-2">
              {contentLoading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin mr-2" /> Loading scripture...
                </div>
              ) : verseError ? (
                <p className="text-red-500">Error loading scripture. {(verseError as Error)?.message}</p>
              ) : isWholeChapter ? (
                parsedContent.map((line, idx) => (
                  <div key={idx} className={highlightIndex === idx ? "bg-yellow-200 dark:bg-yellow-600/40 px-2 rounded" : ""}>
                    {line}
                  </div>
                ))
              ) : (
                // For single verse, parsedContent should ideally contain one element.
                <div className={highlightIndex === 0 ? "bg-yellow-200 dark:bg-yellow-600/40 px-2 rounded" : ""}>
                  {parsedContent[0] || (verseData === "Verse not found." ? verseData : "Verse content not available.")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
