
export interface IdeaSparkResult {
  id: string;
  timestamp: number;
  inputNotes: string;
  inputMediaNames: string[];
  storyIdeas: string[];
  rating?: number;
}

export interface WebInsightResult {
  id: string;
  timestamp: number;
  urls: string[];
  summary: string;
  rating?: number;
}

export interface MoodBoardResult {
  id: string;
  timestamp: number;
  inputMediaNames: string[];
  keywords: string;
  generatedImages: string[]; 
  explanation?: string;
  rating?: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  ideaSparks: IdeaSparkResult[];
  webInsights: WebInsightResult[];
  moodBoards: MoodBoardResult[];
}
