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
  CardFooter 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";

// Bible references for demo purposes
const popularVerses = [
  { reference: "John 3:16", translation: "NIV" },
  { reference: "Genesis 1:1", translation: "NIV" },
  { reference: "Psalm 23:1", translation: "NIV" },
  { reference: "Romans 8:28", translation: "NIV" }
];

export default function BibleReader() {
  const { user } = useAuth();
  const isChild = user?.role === "child";
  
  const [activeTab, setActiveTab] = useState("read");
  const [bibleReference, setBibleReference] = useState("John 3:16");
  const [bibleTranslation, setBibleTranslation] = useState("NIV");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Bible verse
  const { data: verseData, isLoading: verseLoading } = useQuery({
    queryKey: [`/api/bible/verse?reference=${bibleReference}&translation=${bibleTranslation}`],
    enabled: bibleReference.length > 0
  });

  // Fetch search results when search is performed
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: [`/api/bible/search?q=${searchQuery}&translation=${bibleTranslation}`],
    enabled: searchQuery.length > 0 && activeTab === "search"
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // The query will automatically run based on the updated searchQuery state
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
                  <Label htmlFor="translation" className="sr-only">Translation</Label>
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="read" className="m-0">
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <Input
                      value={bibleReference}
                      onChange={(e) => setBibleReference(e.target.value)}
                      placeholder="Enter Bible reference (e.g., John 3:16)"
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
                    <div className="text-center py-10">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">Loading verse...</p>
                    </div>
                  ) : !verseData || verseData.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-lg text-gray-700 dark:text-gray-300">Verse not found</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Try a different reference (e.g., John 3:16)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-300">
                        {verseData[0].reference} ({verseData[0].translation})
                      </h2>
                      <p className="text-lg font-serif leading-relaxed text-gray-800 dark:text-gray-200">
                        {verseData[0].text}
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="search" className="m-0">
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
                    <div className="text-center py-10">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">Searching...</p>
                    </div>
                  ) : !searchQuery ? (
                    <div className="text-center py-10">
                      <Search className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        Enter a search term to find verses
                      </p>
                    </div>
                  ) : !searchResults || searchResults.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        No results found for "{searchQuery}"
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Try a different search term
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Found {searchResults.length} results for "{searchQuery}"
                      </p>
                      {searchResults.map((result, index) => (
                        <div 
                          key={index} 
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                          onClick={() => handleVerseSelect(result.reference, result.translation)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium text-primary-700 dark:text-primary-300">
                              {result.reference}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {result.translation}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 font-serif">
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
          
          <CardFooter className="flex flex-wrap gap-2 justify-between border-t p-4 bg-gray-50 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Popular verses:
            </div>
            <div className="flex flex-wrap gap-2">
              {popularVerses.map((verse, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleVerseSelect(verse.reference, verse.translation)}
                >
                  {verse.reference}
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>
        
        {/* Help section for children */}
        {isChild && (
          <Card className="mt-6 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-accent-600 dark:text-accent-400">Bible Reading Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4 items-start">
                  <div className="bg-accent-100 dark:bg-accent-900/20 rounded-full p-2 text-accent-600 dark:text-accent-400">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Pray First</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ask God to help you understand what you're about to read.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex space-x-4 items-start">
                  <div className="bg-accent-100 dark:bg-accent-900/20 rounded-full p-2 text-accent-600 dark:text-accent-400">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Read Slowly</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Take your time and think about what each verse means.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex space-x-4 items-start">
                  <div className="bg-accent-100 dark:bg-accent-900/20 rounded-full p-2 text-accent-600 dark:text-accent-400">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Ask Questions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      What is this teaching me about God? How can I apply this to my life?
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
