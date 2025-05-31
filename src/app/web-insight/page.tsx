
"use client";

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { webInsightExtractor, type WebInsightExtractorInput, type WebInsightExtractorOutput } from '@/ai/flows/web-insight-extractor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/common/page-title';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Globe, Link as LinkIcon, Trash2, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function WebInsightPage() {
  const [urls, setUrls] = useState<string[]>(['']);
  const { toast } = useToast();

  const mutation = useMutation<WebInsightExtractorOutput, Error, WebInsightExtractorInput>({
    mutationFn: webInsightExtractor,
    onSuccess: (data) => {
      toast({
        title: "Insights Extracted!",
        description: "Summary generated from the provided URLs.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Extracting Insights",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlInput = () => {
    setUrls([...urls, '']);
  };

  const removeUrlInput = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
    } else {
      setUrls(['']); // Keep at least one input, just clear it
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validUrls = urls.filter(url => url.trim() !== '' && /^(ftp|http|https):\/\/[^ "]+$/.test(url.trim()));
    if (validUrls.length === 0) {
      toast({
        title: "No Valid URLs",
        description: "Please enter at least one valid URL.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate({ urls: validUrls });
  };

  return (
    <div className="space-y-8">
      <PageTitle
        title="Web Insight Extractor"
        description="Input URLs of web pages. The AI will summarize key filmmaking information and highlight connections."
      />

      <Card>
        <CardHeader>
          <CardTitle>Extract Filmmaking Insights</CardTitle>
          <CardDescription>Enter URLs of articles, resources, or research pages.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {urls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="flex-grow"
                />
                {urls.length > 1 && (
                  <Button variant="ghost" size="icon" type="button" onClick={() => removeUrlInput(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addUrlInput} size="sm">
              Add Another URL
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Globe className="mr-2 h-4 w-4" />
              )}
              Extract Insights
            </Button>
          </CardFooter>
        </form>
      </Card>

      {mutation.isError && (
         <Alert variant="destructive">
           <Globe className="h-4 w-4" />
           <AlertTitle>Error Extracting Insights</AlertTitle>
           <AlertDescription>{mutation.error.message}</AlertDescription>
         </Alert>
      )}

      {mutation.data && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Summary</CardTitle>
            <CardDescription>Key information and connections from the provided URLs:</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>{mutation.data.summary}</p>
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

