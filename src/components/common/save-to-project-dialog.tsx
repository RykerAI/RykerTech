
"use client";

import React, { useState, useEffect } from 'react';
import { useProjects } from '@/hooks/use-projects';
import type { Project, IdeaSparkResult, WebInsightResult, MoodBoardResult } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Save } from 'lucide-react';

type ContentType = 'ideaSparks' | 'webInsights' | 'moodBoards';
type SaveableContent = Omit<IdeaSparkResult, 'id' | 'timestamp' | 'rating'> | Omit<WebInsightResult, 'id' | 'timestamp' | 'rating'> | Omit<MoodBoardResult, 'id' | 'timestamp' | 'rating'>;

interface SaveToProjectDialogProps {
  content: SaveableContent;
  contentType: ContentType;
  triggerButton?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaveToProjectDialog({ 
  content, 
  contentType, 
  triggerButton,
  isOpen,
  onOpenChange
}: SaveToProjectDialogProps) {
  const { projects, createProject, addContentToProject } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);
  
  const handleSave = () => {
    let projectIdToSaveTo = selectedProjectId;

    if (isCreatingNewProject) {
      if (!newProjectName.trim()) {
        toast({ title: "New project name is required", variant: "destructive" });
        return;
      }
      const newProject = createProject(newProjectName);
      if (newProject) {
        projectIdToSaveTo = newProject.id;
      } else {
        // createProject shows its own toast on failure
        return;
      }
    }

    if (!projectIdToSaveTo) {
      toast({ title: "Please select or create a project", variant: "destructive" });
      return;
    }

    const success = addContentToProject(projectIdToSaveTo, contentType, content);
    if (success) {
      toast({ title: "Content saved successfully!" });
      onOpenChange(false); // Close dialog
      setNewProjectName('');
      setIsCreatingNewProject(false);
    } else {
      // addContentToProject shows its own toast on failure
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to Project</DialogTitle>
          <DialogDescription>
            Select an existing project or create a new one to save this content.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {isCreatingNewProject ? (
            <div className="space-y-2">
              <Input 
                placeholder="New Project Name" 
                value={newProjectName} 
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <Button variant="link" size="sm" onClick={() => setIsCreatingNewProject(false)} className="p-0 h-auto">
                Or select existing project
              </Button>
            </div>
          ) : (
            projects.length > 0 ? (
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">No projects available. Create one below.</p>
            )
          )}

          {!isCreatingNewProject && (
            <Button variant="outline" size="sm" onClick={() => {setIsCreatingNewProject(true); setSelectedProjectId('');}}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
            </Button>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={(!selectedProjectId && !isCreatingNewProject) || (isCreatingNewProject && !newProjectName.trim())}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
