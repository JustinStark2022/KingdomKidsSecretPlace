import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BibleReader from "@/components/scripture/BibleReader";
import ScriptureMemorization from "@/components/scripture/ScriptureMemorization";
import PrayerJournal from "@/components/scripture/PrayerJournal";
import { BookOpen, Star, BookHeart } from "lucide-react";

const Bible: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="reader">
        <TabsList>
          <TabsTrigger value="reader" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Bible Reader
          </TabsTrigger>
          <TabsTrigger value="memorize" className="flex items-center">
            <Star className="mr-2 h-4 w-4" />
            Scripture Memorization
          </TabsTrigger>
          <TabsTrigger value="prayer" className="flex items-center">
            <BookHeart className="mr-2 h-4 w-4" />
            Prayer Journal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reader">
          <BibleReader />
        </TabsContent>

        <TabsContent value="memorize">
          <ScriptureMemorization />
        </TabsContent>

        <TabsContent value="prayer">
          <PrayerJournal />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bible;
