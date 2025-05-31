
"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface StarRatingProps {
  count?: number;
  value?: number;
  onValueChange?: (rating: number) => void;
  size?: number;
  className?: string;
  isEditable?: boolean;
}

export function StarRating({
  count = 5,
  value = 0,
  onValueChange,
  size = 20, // size in pixels
  className,
  isEditable = true,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);

  const stars = Array.from({ length: count }, (_, i) => i + 1);

  const handleClick = (rating: number) => {
    if (isEditable && onValueChange) {
      onValueChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (isEditable) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (isEditable) {
      setHoverValue(undefined);
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {stars.map((starValue) => (
        <Button
          key={starValue}
          variant="ghost"
          size="icon"
          className={cn("h-auto w-auto p-0", !isEditable && "cursor-default")}
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
          aria-label={`Rate ${starValue} out of ${count} stars`}
          disabled={!isEditable}
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors",
              (hoverValue || value) >= starValue
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground fill-muted-foreground/50",
              isEditable && "hover:text-yellow-300"
            )}
          />
        </Button>
      ))}
    </div>
  );
}
