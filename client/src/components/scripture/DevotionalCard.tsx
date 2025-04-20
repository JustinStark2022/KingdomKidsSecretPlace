import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface DevotionalCardProps {
  title: string;
  date: string;
  verse: string;
  reference: string;
  content: string;
  imageSrc?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
  onReadMore?: () => void;
  className?: string;
}

const DevotionalCard: React.FC<DevotionalCardProps> = ({
  title,
  date,
  verse,
  reference,
  content,
  imageSrc,
  isFavorite = false,
  onToggleFavorite,
  onShare,
  onReadMore,
  className
}) => {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl shadow-lg border border-yellow-300 dark:border-yellow-500 hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      {imageSrc && (
        <div className="relative h-40">
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover brightness-95 dark:brightness-75"
          />
        </div>
      )}

      <CardContent className="p-5">
        <div className="mb-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-xl text-yellow-900 dark:text-yellow-300">{title}</h3>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-400 px-3 py-2 mt-2 rounded-md shadow-sm">
            <p className="text-sm font-serif italic text-yellow-800 dark:text-yellow-200">
              "{verse}" – {reference}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {content}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-yellow-600"
              onClick={onToggleFavorite}
            >
              <Heart
                className={cn(
                  "h-4 w-4 mr-1",
                  isFavorite && "fill-yellow-500 text-yellow-600"
                )}
              />
              {isFavorite ? "Saved" : "Save"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-yellow-600"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="text-yellow-700 border-yellow-400 hover:bg-yellow-100 dark:text-yellow-300 dark:border-yellow-600"
            onClick={onReadMore}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Read More
          </Button>
        </div>

        <div className="mt-4 text-xs italic text-muted-foreground">
          🌟 <strong>Family Tip:</strong> Talk about how this message could inspire your day together!
        </div>
      </CardContent>
    </Card>
  );
};

export default DevotionalCard;
