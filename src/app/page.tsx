
import { PageTitle } from "@/components/common/page-title";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Globe, ImageIcon as MoodBoardIcon, Folder } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageTitle
        title="Welcome to RYK AI MediaSpark"
        description="Your AI-powered companion for creative media projects. Get started by exploring the tools below."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="h-6 w-6 text-accent" />
              Idea Spark
            </CardTitle>
            <CardDescription>
              Upload mixed media to generate unique story ideas and thematic concepts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/idea-spark" passHref>
              <Button className="w-full" variant="outline">
                Spark Ideas <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Globe className="h-6 w-6 text-accent" />
              Web Insight Extractor
            </CardTitle>
            <CardDescription>
              Summarize key filmmaking info from web pages and find connections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/web-insight" passHref>
              <Button className="w-full" variant="outline">
                Extract Insights <Globe className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <MoodBoardIcon className="h-6 w-6 text-accent" />
              Mood Board Generator
            </CardTitle>
            <CardDescription>
              Create visual mood boards from your assets and keywords to set the tone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/mood-board" passHref>
              <Button className="w-full" variant="outline">
                Generate Mood Board <MoodBoardIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Folder className="h-6 w-6 text-accent" />
              Projects
            </CardTitle>
            <CardDescription>
              Manage your saved ideas, insights, and mood boards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/projects" passHref>
              <Button className="w-full" variant="outline">
                View Projects <Folder className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
