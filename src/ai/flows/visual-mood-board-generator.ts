
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
        // Ensure URI is not empty or whitespace
        if (uri.trim()) {
            imageGenPromptParts.push({media: {url: uri}});
        }
      });
    }

    imageGenPromptParts.push({text: `Generate a visual mood board consisting of 3 diverse images and a brief explanation for the theme: "${input.prompt}". The images should visually represent the mood and keywords. The explanation should describe the overall feeling and key visual elements.`});
    

    const {text, media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: imageGenPromptParts,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        // Safety settings can be adjusted here if needed, using defaults for now.
        // safetySettings: [ { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' } ] // Example
      },
      // Removed output format and schema, as gemini-2.0-flash-exp does not support JSON output when generating images.
    });

    const moodBoardImages = media?.map(m => m.url!).filter(url => !!url) || []; // Ensure media and url exist
    
    let explanationText = "The AI model generated a visual mood board based on your input."; // Default fallback
    if (text && text.trim()) {
        explanationText = text.trim();
    }

    return {
      moodBoardImages: moodBoardImages,
      explanation: explanationText,
    };
  }
);

