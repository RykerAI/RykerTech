
"use client";

import React, { useState } from 'react';
import { useProjects } from '@/hooks/use-projects';
import { PageTitle } from '@/components/common/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Folder, Edit3, Trash2, PlusCircle, Star, Sparkles, Globe, ImageIcon as MoodBoardIcon } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Project, IdeaSparkResult, WebInsightResult, MoodBoardResult } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';

const ProjectItemCard: React.FC<{ item: IdeaSparkResult | WebInsightResult | MoodBoardResult, type: string, projectId: string, onDelete: () => void, onRate: (rating: number) => void }> = ({ item, type, projectId, onDelete, onRate }) => {
  const renderContent = () => {
    if (type === 'Idea Spark' && 'storyIdeas' in item) {
      return (
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {(item as IdeaSparkResult).storyIdeas.slice(0, 3).map((idea, i) => <li key={i}>{idea}</li>)}
          {(item as IdeaSparkResult).storyIdeas.length > 3 && <li>...and more</li>}
        </ul>
      );
    }
    if (type === 'Web Insight' && 'summary' in item) {
      return <p className="text-sm truncate_3_lines">{(item as WebInsightResult).summary}</p>;
    }
    if (type === 'Mood Board' && 'generatedImages' in item) {
      return (
        <div className="flex space-x-1 mt-1">
          {(item as MoodBoardResult).generatedImages.slice(0, 4).map((img, i) => (
            <div key={i} className="w-10 h-10 relative rounded overflow-hidden">
            <Image src={img.startsWith('data:') ? img : \`https://placehold.co/40x40.png?text=...\`} alt="mood image" layout="fill" objectFit="cover" data-ai-hint="thumbnail image"/>
            </div>
          ))}
          {(item as MoodBoardResult).generatedImages.length > 4 && <div className="w-10 h-10 bg-muted flex items-center justify-center rounded text-xs">+{ (item as MoodBoardResult).generatedImages.length - 4}</div>}
        </div>
      );
    }
    return <p className="text-sm text-muted-foreground">No preview available.</p>;
  };

  const [showRating, setShowRating] = useState(false);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{type} - {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowRating(!showRating)}>
            <Star className={`h-4 w-4 ${item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {renderContent()}
        {showRating && (
          <div className="mt-2 flex space-x-1">
            {[1,2,3,4,5].map(rate => (
              <Button key={rate} variant={item.rating === rate ? "default" : "outline"} size="icon" className="h-7 w-7" onClick={() => { onRate(rate); setShowRating(false);}}>
                <Star className={`h-4 w-4 ${item.rating && item.rating >= rate ? 'text-yellow-400 fill-yellow-400' : ''}`} />
              </Button>
            ))}
          </Button>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="mr-1 h-3 w-3" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function ProjectsPage() {
  const { projects, createProject, deleteProject, updateProjectName, getProject, addContentToProject, removeContentFromProject, rateContent } = useProjects();
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName);
      setNewProjectName('');
    }
  };

  const handleUpdateProjectName = () => {
    if (editingProject && editingProjectName.trim()) {
      updateProjectName(editingProject.id, editingProjectName);
      setEditingProject(null);
      setEditingProjectName('');
    }
  };
  
  const selectedProject = selectedProjectId ? getProject(selectedProjectId) : null;

  return (
    <div className="space-y-8">
      <PageTitle title="Your Projects" description="Manage your saved creative assets and research." />

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Enter a name for your new project.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Project Name (e.g., Sci-Fi Short Film)"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="my-4"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>Create Project</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project Name</DialogTitle>
            </DialogHeader>
            <Input
              value={editingProjectName}
              onChange={(e) => setEditingProjectName(e.target.value)}
              className="my-4"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
              <Button onClick={handleUpdateProjectName} disabled={!editingProjectName.trim()}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {projects.length === 0 && (
        <Card className="mt-6 text-center py-10">
          <CardContent>
            <Folder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">You haven't created any projects yet.</p>
            <p className="text-sm text-muted-foreground">Click "Create New Project" to get started.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex-grow">
              <CardTitle className="flex items-center justify-between">
                <span className="truncate font-headline cursor-pointer hover:text-primary" onClick={() => setSelectedProjectId(project.id)}>{project.name}</span>
                 <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingProject(project); setEditingProjectName(project.name); }}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteProject(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {project.ideaSparks.length} Ideas, {project.webInsights.length} Insights, {project.moodBoards.length} Boards
              </CardDescription>
            </CardHeader>
            <CardFooter className="text-xs text-muted-foreground">
              Last updated: {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProjectId(null)}>
          <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="font-headline">{selectedProject.name}</DialogTitle>
              <DialogDescription>
                Created: {new Date(selectedProject.createdAt).toLocaleDateString()} | Last Updated: {formatDistanceToNow(new Date(selectedProject.updatedAt), { addSuffix: true })}
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="ideaSparks" className="flex-grow flex flex-col overflow-hidden">
              <TabsList className="shrink-0">
                <TabsTrigger value="ideaSparks"><Sparkles className="mr-2 h-4 w-4" />Ideas ({selectedProject.ideaSparks.length})</TabsTrigger>
                <TabsTrigger value="webInsights"><Globe className="mr-2 h-4 w-4" />Insights ({selectedProject.webInsights.length})</TabsTrigger>
                <TabsTrigger value="moodBoards"><MoodBoardIcon className="mr-2 h-4 w-4" />Mood Boards ({selectedProject.moodBoards.length})</TabsTrigger>
              </TabsList>
              <ScrollArea className="flex-grow mt-2 pr-3">
                <TabsContent value="ideaSparks" className="grid gap-4">
                  {selectedProject.ideaSparks.length > 0 ? selectedProject.ideaSparks.map(item => (
                    <ProjectItemCard key={item.id} item={item} type="Idea Spark" projectId={selectedProject.id} onDelete={() => removeContentFromProject(selectedProject.id, 'ideaSparks', item.id)} onRate={(r) => rateContent(selectedProject.id, 'ideaSparks', item.id, r)} />
                  )) : <p className="text-muted-foreground p-4 text-center">No Idea Sparks saved in this project.</p>}
                </TabsContent>
                <TabsContent value="webInsights" className="grid gap-4">
                   {selectedProject.webInsights.length > 0 ? selectedProject.webInsights.map(item => (
                    <ProjectItemCard key={item.id} item={item} type="Web Insight" projectId={selectedProject.id} onDelete={() => removeContentFromProject(selectedProject.id, 'webInsights', item.id)} onRate={(r) => rateContent(selectedProject.id, 'webInsights', item.id, r)} />
                  )) : <p className="text-muted-foreground p-4 text-center">No Web Insights saved in this project.</p>}
                </TabsContent>
                <TabsContent value="moodBoards" className="grid gap-4">
                  {selectedProject.moodBoards.length > 0 ? selectedProject.moodBoards.map(item => (
                    <ProjectItemCard key={item.id} item={item} type="Mood Board" projectId={selectedProject.id} onDelete={() => removeContentFromProject(selectedProject.id, 'moodBoards', item.id)} onRate={(r) => rateContent(selectedProject.id, 'moodBoards', item.id, r)} />
                  )) : <p className="text-muted-foreground p-4 text-center">No Mood Boards saved in this project.</p>}
                </TabsContent>
              </ScrollArea>
            </Tabs>
            <DialogFooter className="mt-4 shrink-0">
              <Button variant="outline" onClick={() => setSelectedProjectId(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// CSS for truncate (if not using a Tailwind plugin)
// Add to globals.css or a style tag for development.
// .truncate_3_lines {
//   overflow: hidden;
//   text-overflow: ellipsis;
//   display: -webkit-box;
//   -webkit-line-clamp: 3;
//   -webkit-box-orient: vertical;
// }
// For simplicity here, it's just a class name. Actual truncation might require more setup.
// Using Image component for Moodboard preview.
import Image from 'next/image';
