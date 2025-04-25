import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import ParentLayout from "@/components/layout/parent-layout";
import ChildLayout from "@/components/layout/child-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";

// Demo data only — replace with actual API output later
type Verse = {
  reference: string;
  translation: string;
  text: string;
};

const popularVerses = [
  { reference: "John 3:16", translation: "NIV" },
  { reference: "Genesis 1:1", translation: "NIV" },
  { reference: "Psalm 23:1", translation: "NIV" },
  { reference: "Romans 8:28", translation: "NIV" },
];

export default function BibleReader() {
  const { user } = useAuth();
  const isChild = user?.role === "child";

  const [activeTab, setActiveTab] = useState("read");
  const [bibleReference, setBibleReference] = useState("John 3:16");
  const [bibleTranslation, setBibleTranslation] = useState("NIV");
  const [searchQuery, setSearchQuery] = useState("");

  // --- Fetch Verse ---
  const {
    data: verseData,
    isLoading: verseLoading,
  } = useQuery<Verse[]>({
    queryKey: ["bibleVerse", bibleReference, bibleTranslation],
    queryFn: async () => {
      const res = await fetch(
        `/api/bible/verse?reference=${encodeURIComponent(
          bibleReference
        )}&translation=${bibleTranslation}`
      );
      return res.json();
    },
    enabled: !!bibleReference,
  });

  // --- Search Bible ---
  const {
    data: searchResults,
    isLoading: searchLoading,
  } = useQuery<Verse[]>({
    queryKey: ["bibleSearch", searchQuery, bibleTranslation],
    queryFn: async () => {
      const res = await fetch(
        `/api/bible/search?q=${encodeURIComponent(
          searchQuery
        )}&translation=${bibleTranslation}`
      );
      return res.json();
    },
    enabled: !!searchQuery && activeTab === "search",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab("search");
    }
  };

  const handleVerseSelect = (reference: string, translation: string) => {
    setBibleReference(reference);
    setBibleTranslation(translation);
    setActiveTab("read");
  };

  const Layout = isChild ? ChildLayout : ParentLayout;

  return (
    <Layout title="Bible Reader">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-primary-50 dark:bg-primary-900/20 rounded-t-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="flex items-center text-xl font-bold text-primary-700 dark:text-primary-300">
                <BookOpen className="mr-2 h-6 w-6" />
                Bible Reader
              </CardTitle>

              <div className="flex flex-wrap gap-2">
                <div>
                  <Label htmlFor="translation" className="sr-only">
                    Translation
                  </Label>
                  <Select
                    value={bibleTranslation}
                    onValueChange={setBibleTranslation}
                  >
                    <SelectTrigger id="translation" className="w-[120px]">
                      <SelectValue placeholder="Translation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NIrV">NIrV</SelectItem>
                      <SelectItem value="NIV">NIV</SelectItem>
                      <SelectItem value="NLT">NLT</SelectItem>
                      <SelectItem value="ERV">ERV</SelectItem>
                      <SelectItem value="CSB">CSB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant={activeTab === "read" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("read")}
                >
                  Read
                </Button>

                <Button
                  variant={activeTab === "search" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("search")}
                >
                  Search
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="read">
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <Input
                      value={bibleReference}
                      onChange={(e) => setBibleReference(e.target.value)}
                      placeholder="e.g., John 3:16"
                      className="mr-2"
                    />
                    <Button variant="outline" size="icon">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="ml-1">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[500px] p-6">
                  {verseLoading ? (
                    <div className="text-center py-10">Loading...</div>
                  ) : !verseData || verseData.length === 0 ? (
                    <div className="text-center py-10">
                      Verse not found. Try a different reference.
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-300">
                        {verseData[0].reference} ({verseData[0].translation})
                      </h2>
                      <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                        {verseData[0].text}
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="search">
                <div className="p-4 border-b">
                  <form onSubmit={handleSearch} className="flex items-center">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search the Bible..."
                      className="mr-2"
                    />
                    <Button type="submit" size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </form>
                </div>

                <ScrollArea className="h-[500px] p-6">
                  {searchLoading ? (
                    <div className="text-center py-10">Searching...</div>
                  ) : !searchResults || searchResults.length === 0 ? (
                    <div className="text-center py-10">
                      No results found for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.map((result, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleVerseSelect(result.reference, result.translation)
                          }
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <h3 className="font-medium text-primary-700 dark:text-primary-300">
                            {result.reference}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            {result.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-between p-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Popular verses:
            </span>
            <div className="flex flex-wrap gap-2">
              {popularVerses.map((v, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant="outline"
                  onClick={() => handleVerseSelect(v.reference, v.translation)}
                >
                  {v.reference}
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
