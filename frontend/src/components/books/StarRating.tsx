'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  fillColor?: string;
  emptyColor?: string;
  className?: string;
  onRatingChange?: (rating: number) => void;
  isEditable?: boolean;
}

export function StarRating({
  rating,
  totalStars = 5,
  size = 20,
  fillColor = "text-accent",
  emptyColor = "text-muted-foreground/30",
  className,
  onRatingChange,
  isEditable = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = (rate: number) => {
    if (isEditable && onRatingChange) {
      onRatingChange(rate);
    }
  };

  const handleMouseEnter = (rate: number) => {
    if (isEditable) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (isEditable) {
      setHoverRating(0);
    }
  };
  
  const currentRating = hoverRating || rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              starValue <= currentRating ? fillColor : emptyColor,
              isEditable && 'cursor-pointer transition-transform hover:scale-125'
            )}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            fill="currentColor"
          />
        );
      })}
    </div>
  );
}
