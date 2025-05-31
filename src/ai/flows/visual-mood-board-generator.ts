// VisualMoodBoardGenerator.ts
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
      'An array of media files (images/footage), as data URIs that must include a MIME type and use Base64 encoding. Expected format: [\