import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DevotionalCard from "@/components/scripture/DevotionalCard";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Heart, BarChart4, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type Devotional = {
  id: number;
  title: string;
  verse: string;
  reference: string;
  content: string;
  date: string;
  image?: string;
  tags: string[];
};

const Devotionals: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const { data: devotionals, isLoading } = useQuery<Devotional[]>({
    queryKey: ["/api/devotionals"],
  });

  const filteredDevotionals = devotionals?.filter((devotional) =>
    devotional.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    devotional.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    devotional.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (devotionalId: number) => {
    setFavorites((prev) =>
      prev.includes(devotionalId)
        ? prev.filter((id) => id !== devotionalId)
        : [...prev, devotionalId]
    );
  };

  const handleShare = (devotional: Devotional) => {
    alert(`Sharing: ${devotional.title}`);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/childdashboardbg.png')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-sm z-0" />

      {/* Page Content */}
      <div className="relative z-10 px-4 py-10 flex justify-center">
        <div className="w-full max-w-6xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-600">Daily Devotionals</h1>
            <p className="text-gray-700 dark:text-gray-300">
              Bible-based encouragement for the whole family
            </p>
          </div>

          {/* Search & Progress Bar */}
          {!selectedDevotional && (
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="relative flex-1 w-full max-w-3xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search devotionals..."
                  className="pl-10 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2 self-end">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">{filteredDevotionals?.length || 0}</span> devotionals
                </p>
                <Button variant="outline" size="sm">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  Progress
                </Button>
              </div>
            </div>
          )}

          {/* Today's Devotional */}
          {!selectedDevotional && (
            <>
              <h2 className="text-xl font-bold text-cyan-500">Today's Devotional</h2>
              {isLoading ? (
                <Skeleton className="h-64 w-full max-w-3xl mx-auto" />
              ) : devotionals && devotionals.length > 0 ? (
                <DevotionalCard
                  {...devotionals[0]}
                  isFavorite={favorites.includes(devotionals[0].id)}
                  onToggleFavorite={() => toggleFavorite(devotionals[0].id)}
                  onShare={() => handleShare(devotionals[0])}
                  onReadMore={() => setSelectedDevotional(devotionals[0])}
                  className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg border border-cyan-200"
                />
              ) : (
                <Card className="max-w-3xl mx-auto">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No devotionals available</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Expanded Devotional */}
          {selectedDevotional && (
            <Card className="bg-white/90 dark:bg-gray-800 border border-cyan-200 shadow-md rounded-xl max-w-4xl mx-auto">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-cyan-600">{selectedDevotional.title}</h2>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(selectedDevotional.date), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDevotional(null)}
                  >
                    Back to List
                  </Button>
                </div>

                {selectedDevotional.image && (
                  <img
                    src={selectedDevotional.image}
                    alt={selectedDevotional.title}
                    className="w-full rounded-md object-cover max-h-80 mb-6"
                  />
                )}

                <div className="p-4 bg-cyan-100 border-l-4 border-cyan-400 rounded-md mb-6">
                  <p className="text-lg font-serif italic text-cyan-800">
                    “{selectedDevotional.verse}” – {selectedDevotional.reference}
                  </p>
                </div>

                <div className="mb-6 space-y-4 text-gray-800 dark:text-gray-200">
                  {selectedDevotional.content.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => toggleFavorite(selectedDevotional.id)}
                      className={favorites.includes(selectedDevotional.id) ? "text-cyan-600" : ""}
                    >
                      <Heart
                        className={`mr-2 h-4 w-4 ${favorites.includes(selectedDevotional.id) ? "fill-cyan-600" : ""}`}
                      />
                      {favorites.includes(selectedDevotional.id) ? "Saved" : "Save for Later"}
                    </Button>
                    <Button variant="outline" onClick={() => handleShare(selectedDevotional)}>
                      Share
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedDevotional.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Devotionals */}
          {!selectedDevotional && (
            <>
              <h2 className="text-xl font-bold text-cyan-500">Recent Devotionals</h2>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))}
                </div>
              ) : filteredDevotionals && filteredDevotionals.length > 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDevotionals.slice(1).map((devotional) => (
                    <DevotionalCard
                      key={devotional.id}
                      {...devotional}
                      isFavorite={favorites.includes(devotional.id)}
                      onToggleFavorite={() => toggleFavorite(devotional.id)}
                      onShare={() => handleShare(devotional)}
                      onReadMore={() => setSelectedDevotional(devotional)}
                      className="bg-white shadow rounded-lg border border-cyan-100"
                    />
                  ))}
                </div>
              ) : (
                <Card className="max-w-3xl mx-auto">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No recent devotionals</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devotionals;
