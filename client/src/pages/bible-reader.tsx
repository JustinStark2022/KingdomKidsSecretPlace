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
import { bibleBooks } from "@/lib/booklist";

export default function BibleReader() {
  const { user } = useAuth();
  const isChild = user?.role === "child";
  const Layout = isChild ? ChildLayout : ParentLayout;

  const [bibleId, setBibleId] = useState("");
  const [bookAbbr, setBookAbbr] = useState("");
  const [chapterNum, setChapterNum] = useState("");
  const [verseId, setVerseId] = useState("entire");
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const chapterId = bookAbbr && chapterNum ? `${bookAbbr}.${chapterNum}` : "";
  const fullVerseId =
    verseId !== "entire" ? `${bookAbbr}.${chapterNum}.${verseId}` : "";

    const {
      data: biblesData,
      isLoading: loadingBibles,
      isError: errorLoadingBibles,
    } = useQuery({
      queryKey: ["bibles"],
      queryFn: async () => {
        const res = await fetch("/api/bible/bibles", {
          credentials: "include",
        });
        const json = await res.json();
        console.log("🔍 Bible fetch result:", json); // <- required log
    
        if (!json?.data || !Array.isArray(json.data)) {
          throw new Error("Bible list not available");
        }
    
        return json.data;
      },
      retry: false,
    });
    
    
    const mainVersions = ["ENGKJV", "ENGNIV", "NIRV", "ENGNLT", "ESV", "WEB", "ASV"];


    console.log("📖 All abbreviations:", biblesData?.map((b: any) => b.abbreviation));
    const filteredBibles = (biblesData || []).filter((b: any) =>
      mainVersions.includes(b.abbreviation?.toUpperCase())
    );
    
  useEffect(() => {
    if (
      bibleId === "" &&
      Array.isArray(filteredBibles) &&
      filteredBibles.length > 0
    ) {
      const defaultBible =
        filteredBibles.find(
          (b: { abbreviation: string }) =>
            b.abbreviation?.toUpperCase() === "NIRV"
        ) || filteredBibles[0];

      setBibleId(defaultBible.id);
    }
  }, [filteredBibles]);

  const { data: chapterData, isLoading: loadingChapter } = useQuery({
    queryKey: ["chapter", bibleId, chapterId],
    queryFn: async () => {
      const res = await fetch(
        `/api/bible/bibles/${bibleId}/chapters/${chapterId}`
      );
      const json = await res.json();
      return json.data;
    },
    enabled: !!bibleId && !!chapterId && verseId === "entire",
  });
  console.log("📘 Chapter Data:", chapterData);
  const { data: verseData, isLoading: loadingVerse } = useQuery({
    queryKey: ["verse", bibleId, fullVerseId],
    queryFn: async () => {
      const res = await fetch(
        `/api/bible/bibles/${bibleId}/verses/${fullVerseId}`
      );
      const json = await res.json();
      return json.data;
    },
    enabled: !!bibleId && !!fullVerseId && verseId !== "entire",
  });
  console.log("📘 Chapter Data:", chapterData);
  console.log("📖 Verse Data:", verseData);
  const parseHTML = (html: string): string[] =>
    html.match(/<span class='verse'[^>]*>(.*?)<\/span>/g)?.map((v) =>
      v.replace(/<[^>]+>/g, "")
    ) || [];

  const verses =
    verseId === "entire" && chapterData?.content
      ? parseHTML(chapterData.content)
      : [];

  const singleVerse =
    verseId !== "entire" && verseData?.content
      ? verseData.content.replace(/<[^>]+>/g, "")
      : "";

  const verseNumbers =
    bookAbbr && chapterNum
      ? Array.from({ length: 50 }, (_, i) => i + 1)
      : [];

  const playTTS = () => {
    const lines = verseId === "entire" ? verses : [singleVerse];
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
              <BookOpen className="w-5 h-5" />
              Bible Reader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Version */}
              <div>
                <label className="block mb-1 font-medium">Version</label>
                <Select value={bibleId} onValueChange={setBibleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingBibles ? (
                      <SelectItem disabled value="loading">
                        Loading...
                      </SelectItem>
                    ) : (
                      filteredBibles.map(
                        (b: { id: string; abbreviation: string }) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.abbreviation}
                          </SelectItem>
                        )
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Book */}
              <div>
                <label className="block mb-1 font-medium">Book</label>
                <Select value={bookAbbr} onValueChange={setBookAbbr}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {bibleBooks.map((book) => (
                      <SelectItem
                        key={book.abbreviation}
                        value={book.abbreviation}
                      >
                        {book.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chapter */}
              <div>
                <label className="block mb-1 font-medium">Chapter</label>
                <Select
                  value={chapterNum}
                  onValueChange={setChapterNum}
                  disabled={!bookAbbr}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookAbbr &&
                      Array.from(
                        {
                          length:
                            bibleBooks.find(
                              (b) => b.abbreviation === bookAbbr
                            )?.chapters || 0,
                        },
                        (_, i) => i + 1
                      ).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Verse */}
              <div>
                <label className="block mb-1 font-medium">Verse</label>
                <Select
                  value={verseId}
                  onValueChange={setVerseId}
                  disabled={!chapterNum}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select verse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entire">Entire Chapter</SelectItem>
                    {verseNumbers.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-4">
              <Button
                onClick={isPlaying ? stopTTS : playTTS}
                disabled={verseId === "entire"
                  ? verses.length === 0
                  : !singleVerse}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {isPlaying ? "Stop" : "Play"}
              </Button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg min-h-[200px] space-y-2">
              {verseId === "entire" ? (
                loadingChapter ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin mr-2" /> Loading chapter...
                  </div>
                ) : (
                  verses.map((line, idx) => (
                    <div
                      key={idx}
                      className={
                        highlightIndex === idx
                          ? "bg-yellow-200 dark:bg-yellow-600/40 px-2 rounded"
                          : ""
                      }
                    >
                      {line}
                    </div>
                  ))
                )
              ) : loadingVerse ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin mr-2" /> Loading verse...
                </div>
              ) : (
                <div
                  className={
                    highlightIndex === 0
                      ? "bg-yellow-200 dark:bg-yellow-600/40 px-2 rounded"
                      : ""
                  }
                >
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
