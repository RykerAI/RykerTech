
"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ideaSpark, type IdeaSparkInput, type IdeaSparkOutput } from '@/ai/flows/idea-spark';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/common/page-title';
import { FileUploader } from '@/components/common/file-uploader';
import { fileToDataURI } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function IdeaSparkPage() {
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const mutation = useMutation<IdeaSparkOutput, Error, IdeaSparkInput>({
    mutationFn: async (input) => {
      // This is a client component, direct call to server action `ideaSpark`
      return await ideaSpark(input);
    },
    onSuccess: (data) => {
      toast({
        title: "Ideas Sparked!",
        description: `Generated ${data.storyIdeas.length} new story ideas.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Sparking Ideas",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length === 0 && !notes.trim()) {
      toast({
        title: "Input Required",
        description: "Please upload some media or add notes to spark ideas.",
        variant: "destructive",
      });
      return;
    }

    try {
      const mediaDataUris = await Promise.all(files.map(fileToDataURI));
      mutation.mutate({ media: mediaDataUris, notes });
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
        title="AI Idea Spark"
        description="Upload mixed media (images, text files) and notes. Our AI will generate story ideas and thematic concepts."
      />

      <Card>
        <CardHeader>
          <CardTitle>Generate Story Ideas</CardTitle>
          <CardDescription>Provide your inspirational materials below.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div>
              <FileUploader
                onFilesChange={setFiles}
                label="Upload Images, Footage Snippets, or Text Files"
                multiple
              />
            </div>
            <div>
              <Textarea
                placeholder="Enter any additional notes, themes, or specific thoughts..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Spark Ideas
            </Button>
          </CardFooter>
        </form>
      </Card>

      {mutation.isError && (
         <Alert variant="destructive">
           <Sparkles className="h-4 w-4" />
           <AlertTitle>Error Generating Ideas</AlertTitle>
           <AlertDescription>{mutation.error.message}</AlertDescription>
         </Alert>
      )}

      {mutation.data && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Story Ideas</CardTitle>
            <CardDescription>Here are some concepts inspired by your input:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mutation.data.storyIdeas.map((idea, index) => (
              <Card key={index} className="bg-secondary/30 p-4 shadow-sm">
                <p className="text-sm">{idea}</p>
                 {/* Placeholder for save/rate actions */}
                 {/* <div className="mt-2 flex justify-end">
                    <Button variant="ghost" size="sm"><Save className="mr-1 h-4 w-4" /> Save</Button>
                 </div> */}
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
