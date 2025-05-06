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
  const [verseId, setVerseId] = useState("");
  const [readWholeChapter, setReadWholeChapter] = useState(true);
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

  // Set default to NIrV if available, else first, after bibles load
  useEffect(() => {
    if (!bibleId && bibles.length > 0) {
      const nirv = bibles.find((b: any) => b.abbreviation === "NIrV");
      setBibleId(nirv ? nirv.id : bibles[0].id);
    }
  }, [bibles, bibleId]);

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

  // Fetch chapter content
  const { data: chapterContent, isLoading: loadingChapterContent } = useQuery({
    queryKey: ["chapterContent", bibleId, chapterId],
    queryFn: async () => {
      if (!bibleId || !chapterId) return null;
      const res = await fetch(`/api/bible/bibles/${bibleId}/chapters/${chapterId}`);
      const data = await res.json();
      return data;
    },
    enabled: !!bibleId && !!chapterId && readWholeChapter,
  });

  // Fetch verse content
  const { data: verseContent, isLoading: loadingVerseContent } = useQuery({
    queryKey: ["verseContent", bibleId, verseId],
    queryFn: async () => {
      if (!bibleId || !verseId) return null;
      const res = await fetch(`/api/bible/bibles/${bibleId}/verses/${verseId}`);
      const data = await res.json();
      return data;
    },
    enabled: !!bibleId && !!verseId && !readWholeChapter,
  });

  // Parse verses from chapter content
  const verses = chapterContent && typeof chapterContent === 'object' && 'content' in chapterContent && chapterContent.content
    ? (chapterContent.content.match(/<span class='verse'[^>]*>(.*?)<\/span>/g)?.map((v: string) => v.replace(/<[^>]+>/g, "")) || [])
    : [];
  const singleVerse = verseContent && typeof verseContent === 'object' && 'content' in verseContent && verseContent.content
    ? verseContent.content.replace(/<[^>]+>/g, "")
    : "";

  // TTS Play/Pause logic
  const playTTS = () => {
    setIsPlaying(true);
    setHighlightIndex(0);
    let lines = readWholeChapter ? verses : [singleVerse];
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
                    {loadingBibles ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
                      bibles?.map((b: any) => (
                        <SelectItem key={b.id} value={b.id}>{b.abbreviation} - {b.name}</SelectItem>
                      ))}
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
                    {loadingBooks ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
                      books?.map((b: any) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
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
                    {loadingChapters ? <SelectItem value="loading" disabled>Loading...</SelectItem> :
                      chapters?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.number || c.id}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Verse</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  type="text"
                  value={verseId}
                  onChange={e => setVerseId(e.target.value)}
                  placeholder="Optional: Enter verse ID"
                  disabled={!chapterId || readWholeChapter}
                />
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={readWholeChapter}
                    onChange={e => setReadWholeChapter(e.target.checked)}
                    id="read-whole-chapter"
                    className="mr-2"
                  />
                  <label htmlFor="read-whole-chapter">Read entire chapter</label>
                </div>
              </div>
            </div>
            <div className="mb-4 flex items-center gap-4">
              <Button
                onClick={isPlaying ? stopTTS : playTTS}
                disabled={readWholeChapter ? !verses.length : !singleVerse}
                variant="secondary"
              >
                <Volume2 className="mr-2 h-5 w-5" />
                {isPlaying ? "Stop" : "Play"}
              </Button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px]">
              {readWholeChapter ? (
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
