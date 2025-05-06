import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import ParentLayout from "@/components/layout/parent-layout";
import ChildLayout from "@/components/layout/child-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookOpen, Volume2, Loader2 } from "lucide-react";

export default function BibleReader() {
  const { user } = useAuth();
  const isChild = user?.role === "child";

  // State for dropdowns
  const [bibleId, setBibleId] = useState("");
  const [bookId, setBookId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [verseSelect, setVerseSelect] = useState("entire");
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fetch available Bibles
  const { data: bibles = [], isLoading: loadingBibles } = useQuery({
    queryKey: ["bibles"],
    queryFn: async () => {
      const res = await fetch("/api/bible/bibles");
      const data = await res.json();
      return data;
    },
  });

  // Only keep the five main English versions (acronyms in uppercase)
  const mainVersions = ["NIRV", "NIV", "KJV", "NLT", "ESV"];
  const filteredBibles = mainVersions
    .map(abbr => bibles.find((b: any) => b.abbreviation.toUpperCase() === abbr))
    .filter(Boolean) as any[];

  // Set default to NIrV if available, else first, after bibles load
  useEffect(() => {
    if (!bibleId && filteredBibles.length > 0) {
      const nirv = filteredBibles.find((b: any) => b.abbreviation.toUpperCase() === "NIRV");
      const defaultId = nirv ? nirv.id : filteredBibles[0].id;
      setBibleId(defaultId.toString());
    }
  }, [filteredBibles, bibleId]);

  // Fetch books for selected Bible
  const { data: books = [], isLoading: loadingBooks } = useQuery({
    queryKey: ["books", bibleId],
    queryFn: async () => {
      if (!bibleId) return [];
      const res = await fetch(`/api/bible/bibles/${bibleId}/books`);
      const data = await res.json();
      return data;
    },
    enabled: !!bibleId,
  });

  // Fetch chapters for selected book
  const { data: chapters = [], isLoading: loadingChapters } = useQuery({
    queryKey: ["chapters", bibleId, bookId],
    queryFn: async () => {
      if (!bibleId || !bookId) return [];
      const res = await fetch(`/api/bible/bibles/${bibleId}/books/${bookId}/chapters`);
      const data = await res.json();
      return data;
    },
    enabled: !!bibleId && !!bookId,
  });

  // New: fetch verses list for selected chapter
  const { data: verseList = [], isLoading: loadingVerses } = useQuery({
    queryKey: ["verseList", bibleId, chapterId],
    queryFn: async () => {
      if (!bibleId || !chapterId) return [];
      const res = await fetch(`/api/bible/bibles/${bibleId}/chapters/${chapterId}/verses`);
      return res.json();
    },
    enabled: !!bibleId && !!chapterId,
  });

  // Fetch chapter content when showing whole chapter
  const readChapter = verseSelect === "entire";
  const { data: chapterContent, isLoading: loadingChapterContent } = useQuery({
    queryKey: ["chapterContent", bibleId, chapterId],
    queryFn: async () => {
      const res = await fetch(`/api/bible/bibles/${bibleId}/chapters/${chapterId}?content-type=text.html`);
      return (await res.json()).data;
    },
    enabled: readChapter && !!bibleId && !!chapterId,
  });

  // Fetch verse content when a specific verse is selected
  const { data: verseContent, isLoading: loadingVerseContent } = useQuery({
    queryKey: ["verseContent", bibleId, verseSelect],
    queryFn: async () => {
      const res = await fetch(`/api/bible/bibles/${bibleId}/verses/${verseSelect}?content-type=text.html`);
      return (await res.json()).data;
    },
    enabled: !!verseSelect,
  });

  // Parse verses from chapter content
  const verses = readChapter && chapterContent?.content
    ? chapterContent.content.match(/<span class='verse'[^>]*>(.*?)<\/span>/g)?.map((v: string) => v.replace(/<[^>]+>/g, "")) || []
    : [];
  const singleVerse = !readChapter && verseContent?.content
    ? verseContent.content.replace(/<[^>]+>/g, "")
    : "";

  // TTS Play/Pause logic
  const playTTS = () => {
    setIsPlaying(true);
    setHighlightIndex(0);
    let lines = readChapter ? verses : [singleVerse];
    let i = 0;
    const speakLine = (idx: number) => {
      if (!lines[idx]) {
        setIsPlaying(false);
        setHighlightIndex(null);
        return;
      }
      setHighlightIndex(idx);
      const utter = new window.SpeechSynthesisUtterance(lines[idx]);
      utter.onend = () => speakLine(idx + 1);
      utter.onerror = () => speakLine(idx + 1);
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    };
    speakLine(0);
  };
  const stopTTS = () => {
    setIsPlaying(false);
    setHighlightIndex(null);
    window.speechSynthesis.cancel();
  };

  const Layout = isChild ? ChildLayout : ParentLayout;

  return (
    <Layout title="Bible Reader">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-primary-50 dark:bg-primary-900/20 rounded-t-lg">
            <CardTitle className="flex items-center text-xl font-bold text-primary-700 dark:text-primary-300">
              <BookOpen className="mr-2 h-6 w-6" />
              Bible Reader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block mb-1 font-medium">Version</label>
                <Select value={bibleId} onValueChange={setBibleId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingBibles ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      filteredBibles.map((b: any) => (
                        <SelectItem key={b.id} value={b.id.toString()}>
                          {b.abbreviation.toUpperCase()}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Book</label>
                <Select value={bookId} onValueChange={setBookId} disabled={!bibleId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingBooks ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      books.map((bk: any) => (
                        <SelectItem key={bk.id} value={bk.id.toString()}>
                          {bk.abbreviation
                            ? bk.abbreviation.toUpperCase()
                            : bk.name.slice(0,3).toUpperCase()}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Chapter</label>
                <Select value={chapterId} onValueChange={setChapterId} disabled={!bookId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingChapters ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      chapters.map((c: any) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.number || c.id}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Verse</label>
                <Select value={verseSelect} onValueChange={setVerseSelect} disabled={!chapterId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select verse or entire chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entire">Entire Chapter</SelectItem>
                    {loadingVerses ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
                      verseList.map((v: any) => (
                        <SelectItem key={v.id} value={v.id}>{v.number}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4 flex items-center gap-4">
              <Button
                onClick={isPlaying ? stopTTS : playTTS}
                disabled={readChapter ? verses.length === 0 : !singleVerse}
                variant="secondary"
              >
                <Volume2 className="mr-2 h-5 w-5" />
                {isPlaying ? "Stop" : "Play"}
              </Button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px]">
              {readChapter ? (
                loadingChapterContent ? (
                  <div className="flex items-center"><Loader2 className="animate-spin mr-2" /> Loading chapter...</div>
                ) : (
                  <div className="space-y-2">
                    {verses.map((v: string, i: number): JSX.Element => (
                      <div
                        key={i}
                        className={
                          highlightIndex === i
                            ? "bg-yellow-200 dark:bg-yellow-700/40 rounded px-2 py-1"
                            : ""
                        }
                      >
                        {v}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                loadingVerseContent ? (
                  <div className="flex items-center"><Loader2 className="animate-spin mr-2" /> Loading verse...</div>
                ) : (
                  <div
                    className={
                      highlightIndex === 0
                        ? "bg-yellow-200 dark:bg-yellow-700/40 rounded px-2 py-1"
                        : ""
                    }
                  >
                    {singleVerse}
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
