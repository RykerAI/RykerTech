'use server';

/**
 * @fileOverview Summarizes key filmmaking information from URLs, highlighting connections between them.
 *
 * - webInsightExtractor - A function that handles the web insight extraction process.
 * - WebInsightExtractorInput - The input type for the webInsightExtractor function.
 * - WebInsightExtractorOutput - The return type for the webInsightExtractor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WebInsightExtractorInputSchema = z.object({
  urls: z
    .array(z.string().url())
    .describe('An array of URLs to analyze for filmmaking insights.'),
});
export type WebInsightExtractorInput = z.infer<typeof WebInsightExtractorInputSchema>;

const WebInsightExtractorOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the key information from the web pages, relevant to filmmaking, highlighting connections between them.'
    ),
});
export type WebInsightExtractorOutput = z.infer<typeof WebInsightExtractorOutputSchema>;

export async function webInsightExtractor(input: WebInsightExtractorInput): Promise<WebInsightExtractorOutput> {
  return webInsightExtractorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'webInsightExtractorPrompt',
  input: {schema: WebInsightExtractorInputSchema},
  output: {schema: WebInsightExtractorOutputSchema},
  prompt: `You are an expert film researcher. Your task is to analyze the content of the provided URLs and provide a concise summary of the key information relevant to filmmaking, highlighting any connections between them.

URLs:
{{#each urls}}- {{{this}}}
{{/each}}`,
});

const webInsightExtractorFlow = ai.defineFlow(
  {
    name: 'webInsightExtractorFlow',
    inputSchema: WebInsightExtractorInputSchema,
    outputSchema: WebInsightExtractorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
