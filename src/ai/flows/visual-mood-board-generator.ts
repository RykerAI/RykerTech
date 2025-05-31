
'use server';

/**
 * @fileOverview Generates a visual mood board from user-uploaded images/footage and a keyword prompt.
 *
 * - generateVisualMoodBoard - A function that handles the visual mood board generation process.
 * - GenerateVisualMoodBoardInput - The input type for the generateVisualMoodBoard function.
 * - GenerateVisualMoodBoardOutput - The return type for the generateVisualMoodBoard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVisualMoodBoardInputSchema = z.object({
  mediaDataUris: z
    .array(z.string())
    .describe(
      "An array of media files (images/footage), as data URIs that must include a MIME type and use Base64 encoding. Expected format: ['data:<mimetype>;base64,<encoded_data>', ...]."
    ),
  prompt: z.string().describe('Keywords or a theme for the mood board (e.g., "nostalgic summer evenings", "cyberpunk cityscapes").'),
});
export type GenerateVisualMoodBoardInput = z.infer<typeof GenerateVisualMoodBoardInputSchema>;

const GenerateVisualMoodBoardOutputSchema = z.object({
  moodBoardImages: z.array(z.string().url()).describe('An array of data URIs of the generated mood board images.'),
  explanation: z.string().describe('A brief explanation or thematic description of the generated mood board.'),
});
export type GenerateVisualMoodBoardOutput = z.infer<typeof GenerateVisualMoodBoardOutputSchema>;

export async function generateVisualMoodBoard(input: GenerateVisualMoodBoardInput): Promise<GenerateVisualMoodBoardOutput> {
  return generateVisualMoodBoardFlow(input);
}

const generateVisualMoodBoardFlow = ai.defineFlow(
  {
    name: 'generateVisualMoodBoardFlow',
    inputSchema: GenerateVisualMoodBoardInputSchema,
    outputSchema: GenerateVisualMoodBoardOutputSchema,
  },
  async (input) => {
    const imageGenPromptParts: ({text: string} | {media: {url: string}})[] = [];

    if (input.mediaDataUris && input.mediaDataUris.length > 0) {
      input.mediaDataUris.forEach(uri => {
        if (uri.trim()) {
            imageGenPromptParts.push({media: {url: uri}});
        }
      });
    }

    imageGenPromptParts.push({text: `Generate a visual mood board consisting of up to 3 diverse images and a brief explanation for the theme: "${input.prompt}". The images should visually represent the mood and keywords. The explanation should describe the overall feeling and key visual elements.`});
    

    const {text, media: rawMedia} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: imageGenPromptParts,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        // safetySettings: [ { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' } ] // Example
      },
    });

    let processedMediaArray: { url: string; contentType?: string }[] = [];
    if (rawMedia) {
      if (Array.isArray(rawMedia)) {
        processedMediaArray = rawMedia;
      } else if (typeof rawMedia === 'object' && rawMedia !== null && 'url' in rawMedia && typeof (rawMedia as any).url === 'string') {
        // Handle case where rawMedia might be a single media object
        processedMediaArray = [rawMedia as { url: string; contentType?: string }];
      }
    }
    
    const moodBoardImages = processedMediaArray.map(m => m.url).filter(url => !!url);
    
    let explanationText = "The AI model generated a visual mood board based on your input.";
    if (text && text.trim()) {
        explanationText = text.trim();
    }

    return {
      moodBoardImages: moodBoardImages,
      explanation: explanationText,
    };
  }
);

