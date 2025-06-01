
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, ThumbsUp, ThumbsDown, Star, Trash2 } from 'lucide-react';
import { StarRating } from './star-rating';
import { SaveToProjectDialog } from './save-to-project-dialog';
import type { IdeaSparkResult, WebInsightResult, MoodBoardResult } from '@/lib/types';
import Image from 'next/image';

type AISavedItem = IdeaSparkResult | WebInsightResult | MoodBoardResult;
type AIOutputContent = Omit<IdeaSparkResult, 'id' | 'timestamp' | 'rating'> | Omit<WebInsightResult, 'id' | 'timestamp' | 'rating'> | Omit<MoodBoardResult, 'id' | 'timestamp' | 'rating'>;
type ContentType = 'ideaSparks' | 'webInsights' | 'moodBoards';

interface OutputDisplayCardProps {
  title: string;
  description?: string;
  contentToSave: AIOutputContent;
  contentType: ContentType;
  children: React.ReactNode;
  initialRating?: number;
  onRate?: (rating: number) => void;
  onDelete?: () => void;
  isSaved?: boolean;
}

export function OutputDisplayCard({
  title,
  description,
  contentToSave,
  contentType,
  children,
  initialRating = 0,
  onRate,
  onDelete,
  isSaved = false,
}: OutputDisplayCardProps) {
  const [rating, setRating] = useState(initialRating);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (onRate) {
      onRate(newRating);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rate:</span>
          <StarRating value={rating} onValueChange={handleRatingChange} size={18} />
        </div>
        <div className="flex items-center gap-2">
          {onDelete && isSaved && (
            <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          )}
          {!isSaved && (
            <Button variant="default" size="sm" onClick={() => setIsSaveDialogOpen(true)}>
              <Save className="mr-1 h-4 w-4" /> Save to Project
            </Button>
          )}
        </div>
      </CardFooter>

      <SaveToProjectDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        content={{...contentToSave, rating: rating > 0 ? rating : undefined } as AIOutputContent}
        contentType={contentType}
      />
    </Card>
  );
}

interface GeneratedIdeaDisplayCardProps {
  ideas: string[];
  inputNotes: string;
  inputMediaNames: string[];
}
export const GeneratedIdeaDisplayCard: React.FC<GeneratedIdeaDisplayCardProps> = ({ ideas, inputNotes, inputMediaNames }) => {
  const contentToSave: Omit<IdeaSparkResult, 'id' | 'timestamp' | 'rating'> = {
    storyIdeas: ideas,
    inputNotes: inputNotes,
    inputMediaNames: inputMediaNames,
  };
  return (
    <OutputDisplayCard title="Generated Story Ideas" contentType="ideaSparks" contentToSave={contentToSave}>
      <ul className="space-y-2 list-disc pl-5">
        {ideas.map((idea, index) => (
          <li key={index} className="text-sm">{idea}</li>
        ))}
      </ul>
    </OutputDisplayCard>
  );
};

interface GeneratedInsightDisplayCardProps {
  summary: string;
  urls: string[];
}
export const GeneratedInsightDisplayCard: React.FC<GeneratedInsightDisplayCardProps> = ({ summary, urls }) => {
   const contentToSave: Omit<WebInsightResult, 'id' | 'timestamp' | 'rating'> = { summary, urls };
  return (
    <OutputDisplayCard title="Extracted Summary" contentType="webInsights" contentToSave={contentToSave}>
      <p className="text-sm whitespace-pre-wrap">{summary}</p>
    </OutputDisplayCard>
  );
};

interface GeneratedMoodboardDisplayCardProps {
  images: string[];
  keywords: string;
  inputMediaNames: string[];
  explanation?: string;
  onImageClick?: (imageUrl: string) => void;
}
export const GeneratedMoodboardDisplayCard: React.FC<GeneratedMoodboardDisplayCardProps> = ({ images, keywords, inputMediaNames, explanation, onImageClick }) => {
  const contentToSave: Omit<MoodBoardResult, 'id' | 'timestamp' | 'rating'> = { 
    generatedImages: images, 
    keywords, 
    inputMediaNames,
    explanation 
  };
  return (
    <OutputDisplayCard title="Generated Mood Board" description={explanation} contentType="moodBoards" contentToSave={contentToSave}>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {images.map((imgSrc, index) => (
            <button
              key={index}
              className="aspect-square relative rounded-md overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => onImageClick && onImageClick(imgSrc)}
              aria-label={`View larger image ${index + 1}`}
            >
              <Image
                src={imgSrc.startsWith('data:') ? imgSrc : 'https://placehold.co/300x300.png'}
                alt={`Mood board image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                data-ai-hint="moodboard visual"
              />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No images were generated.</p>
      )}
    </OutputDisplayCard>
  );
};
