
"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
// Assuming visual-mood-board-generator.ts exports generateVisualMoodBoard function and its types
// If the actual export is different, this import will need to be adjusted.
import { generateVisualMoodBoard, GenerateVisualMoodBoardInput, GenerateVisualMoodBoardOutput } from '@/ai/flows/visual-mood-board-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/common/page-title';
import { FileUploader } from '@/components/common/file-uploader';
import { fileToDataURI } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ImageIcon as MoodBoardIcon, Save } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MoodBoardPage() {
  const [keywords, setKeywords] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const mutation = useMutation<GenerateVisualMoodBoardOutput, Error, GenerateVisualMoodBoardInput>({
    mutationFn: generateVisualMoodBoard, // This function must exist in the imported flow
    onSuccess: (data) => {
      toast({
        title: "Mood Board Generated!",
        description: `Created a mood board with ${data.moodBoardImages.length} images.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Generating Mood Board",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload some images to generate a mood board.",
        variant: "destructive",
      });
      return;
    }
    if (!keywords.trim()) {
      toast({
        title: "Keywords Required",
        description: "Please enter some keywords or a theme for your mood board.",
        variant: "destructive",
      });
      return;
    }

    try {
      const mediaDataUris = await Promise.all(files.map(fileToDataURI));
      mutation.mutate({ mediaDataUris, prompt: keywords });
    } catch (error) {
      toast({
        title: "File Processing Error",
        description: "Could not process uploaded files.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <PageTitle
        title="Visual Mood Board Generator"
        description="Upload images or stock footage and provide keywords. The AI will generate a visual mood board."
      />

      <Card>
        <CardHeader>
          <CardTitle>Create a Mood Board</CardTitle>
          <CardDescription>Upload your visual assets and define a theme.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div>
              <FileUploader
                onFilesChange={setFiles}
                label="Upload Images or Footage Snippets"
                accept="image/*"
                multiple
              />
            </div>
            <div>
              <Input
                placeholder="Enter keywords or a theme (e.g., 'nostalgia', 'dystopian future')"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MoodBoardIcon className="mr-2 h-4 w-4" />
              )}
              Generate Mood Board
            </Button>
          </CardFooter>
        </form>
      </Card>

      {mutation.isError && (
         <Alert variant="destructive">
           <MoodBoardIcon className="h-4 w-4" />
           <AlertTitle>Error Generating Mood Board</AlertTitle>
           <AlertDescription>{mutation.error.message}</AlertDescription>
         </Alert>
      )}

      {mutation.data && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Mood Board</CardTitle>
            {mutation.data.explanation && <CardDescription>{mutation.data.explanation}</CardDescription>}
          </CardHeader>
          <CardContent>
            {mutation.data.moodBoardImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mutation.data.moodBoardImages.map((imgSrc, index) => (
                  <div key={index} className="aspect-square relative rounded-md overflow-hidden shadow-md">
                    <Image
                      src={imgSrc.startsWith('data:') ? imgSrc : `https://placehold.co/300x300.png?text=AI+Image+${index+1}`} // Fallback for non-dataURI
                      alt={`Mood board image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="moodboard visual"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No images were generated for this mood board.</p>
            )}
            {/* Placeholder for save/rate actions */}
            {/* <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm"><Save className="mr-1 h-4 w-4" /> Save</Button>
            </div> */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
