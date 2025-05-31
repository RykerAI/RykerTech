'use server';

/**
 * @fileOverview An AI agent that generates story ideas from mixed media.
 *
 * - ideaSpark - A function that handles the generation of story ideas.
 * - IdeaSparkInput - The input type for the ideaSpark function.
 * - IdeaSparkOutput - The return type for the ideaSpark function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdeaSparkInputSchema = z.object({
  media: z
    .array(z.string())
    .describe(
      'An array of media files, as data URIs that must include a MIME type and use Base64 encoding. Expected format: [data:<mimetype>;base64,<encoded_data>, ...].'
    ),
  notes: z.string().describe('A text description with any ideas.'),
});
export type IdeaSparkInput = z.infer<typeof IdeaSparkInputSchema>;

const IdeaSparkOutputSchema = z.object({
  storyIdeas: z.array(z.string()).describe('An array of story ideas.'),
});
export type IdeaSparkOutput = z.infer<typeof IdeaSparkOutputSchema>;

export async function ideaSpark(input: IdeaSparkInput): Promise<IdeaSparkOutput> {
  return ideaSparkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ideaSparkPrompt',
  input: {schema: IdeaSparkInputSchema},
  output: {schema: IdeaSparkOutputSchema},
  prompt: `You are a creative AI assistant designed to help filmmakers generate novel story ideas.

You will receive a collection of mixed media (stock footage clips, inspirational images) and notes.
Analyze the content and generate a handful of unexpected and potentially inspiring story ideas or thematic concepts that bridge these different media.

Media: {{#each media}} {{media url=this}} {{/each}}

Notes: {{{notes}}}

Story Ideas:`,
});

const ideaSparkFlow = ai.defineFlow(
  {
    name: 'ideaSparkFlow',
    inputSchema: IdeaSparkInputSchema,
    outputSchema: IdeaSparkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
