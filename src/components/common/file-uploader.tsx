
"use client";

import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, FileText, UploadCloud } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  id?: string;
  label?: string;
}

export function FileUploader({
  onFilesChange,
  accept = "image/*,text/plain,.txt,.md",
  multiple = true,
  id = "file-upload",
  label = "Upload Files"
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const updatedFiles = multiple ? [...selectedFiles, ...newFiles] : newFiles;
      setSelectedFiles(updatedFiles);
      onFilesChange(updatedFiles);
      event.target.value = ''; // Reset input to allow re-uploading the same file
    }
  };

  const removeFile = (fileName: string) => {
    const updatedFiles = selectedFiles.filter(file => file.name !== fileName);
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const newFiles = Array.from(event.dataTransfer.files);
      // Filter by accept prop if needed, for simplicity not implemented here
      const updatedFiles = multiple ? [...selectedFiles, ...newFiles] : newFiles;
      setSelectedFiles(updatedFiles);
      onFilesChange(updatedFiles);
      event.dataTransfer.clearData();
    }
  }, [selectedFiles, multiple, onFilesChange]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="space-y-4">
      <div 
        className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer border-border hover:border-primary/50 transition-colors"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onClick={() => document.getElementById(id)?.click()}
      >
        <UploadCloud className="w-12 h-12 text-muted-foreground mb-2" />
        <Label htmlFor={id} className="text-sm font-medium text-primary hover:underline cursor-pointer">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground mt-1">Drag & drop files here, or click to select</p>
        <Input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {selectedFiles.length > 0 && (
        <ScrollArea className="h-40 w-full rounded-md border p-2">
          <div className="space-y-2">
            {selectedFiles.map((file) => (
              <div key={file.name} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md text-sm">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="truncate" title={file.name}>{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)} className="h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
