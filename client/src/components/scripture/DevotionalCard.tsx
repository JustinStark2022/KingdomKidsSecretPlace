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
    <Card className={cn("overflow-hidden", className)}>
      {imageSrc && (
        <div className="relative h-40">
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="mb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{title}</h3>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
          <p className="text-sm font-serif italic mt-2">
            "{verse}" - {reference}
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {content}
        </p>
        
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={onToggleFavorite}
            >
              <Heart
                className={cn(
                  "h-4 w-4 mr-1",
                  isFavorite && "fill-primary text-primary"
                )}
              />
              {isFavorite ? "Saved" : "Save"}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="text-primary"
            onClick={onReadMore}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevotionalCard;
