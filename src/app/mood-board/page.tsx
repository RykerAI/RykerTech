
"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateVisualMoodBoard, GenerateVisualMoodBoardInput, GenerateVisualMoodBoardOutput } from '@/ai/flows/visual-mood-board-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/common/page-title';
import { FileUploader } from '@/components/common/file-uploader';
import { GeneratedMoodboardDisplayCard } from '@/components/common/output-display-card';
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogClose } from '@/components/ui/dialog';
import { fileToDataURI } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ImageIcon as MoodBoardIcon, X } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MoodBoardPage() {
  const [keywords, setKeywords] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const { toast } = useToast();

  const mutation = useMutation<GenerateVisualMoodBoardOutput, Error, GenerateVisualMoodBoardInput>({
    mutationFn: generateVisualMoodBoard,
    onSuccess: (data) => {
      toast({
        title: "Mood Board Generated!",
        description: data.explanation || `Created a mood board with ${data.moodBoardImages.length} images.`,
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
    if (files.length === 0 && !keywords.trim()) {
      toast({
        title: "Input Required",
        description: "Please upload some images or provide keywords for your mood board.",
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
      const mediaDataUris = files.length > 0 ? await Promise.all(files.map(fileToDataURI)) : [];
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
                label="Upload Images or Footage Snippets (Optional)"
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
        <GeneratedMoodboardDisplayCard
          images={mutation.data.moodBoardImages}
          keywords={keywords}
          inputMediaNames={files.map(f => f.name)}
          explanation={mutation.data.explanation}
          onImageClick={(imageUrl) => setViewingImage(imageUrl)}
        />
      )}

      {viewingImage && (
        <Dialog open={!!viewingImage} onOpenChange={(open) => !open && setViewingImage(null)}>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="max-w-3xl max-h-[80vh] p-0">
              <div className="relative w-full h-full">
                <Image
                  src={viewingImage.startsWith('data:') ? viewingImage : 'https://placehold.co/800x600.png'}
                  alt="Enlarged mood board image"
                  layout="responsive"
                  width={800}
                  height={600}
                  objectFit="contain"
                  className="rounded-md"
                  data-ai-hint="enlarged moodboard"
                />
                 <DialogClose className="absolute top-2 right-2 bg-background/70 hover:bg-background rounded-full p-1">
                    <X className="h-5 w-5 text-muted-foreground"/>
                 </DialogClose>
              </div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </div>
  );
}
