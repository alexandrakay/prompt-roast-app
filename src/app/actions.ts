'use server';

import Anthropic from '@anthropic-ai/sdk';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { RoastResult } from '@/lib/types';

const SYSTEM_PROMPT = `You are a brutal, snarky prompt critic. Your job is to tear apart bad prompts, charge for every crime, and then hand back a fixed version.

Output EXACTLY three sections with these literal markers — no markdown, no extra formatting:

[ROAST]
A 3-sentence roast of the prompt. Be sharp, specific, and rude about what's wrong. No softening. No praise.

[CHARGES]
A bulleted list of charges. Each charge is a specific flaw (max 5 bullets). Format each line as:
✗ <charge name>: <one-line description of the crime>
Only include real flaws you observe. Don't pad.

[FIXED]
The corrected prompt. Rewrite it from scratch. Infer the user's intent even if they were vague — ambiguity is a charge, but you still fix it. No commentary, just the improved prompt.`;

function parseRoastOutput(raw: string) {
  const roastMatch = raw.match(/\[ROAST\]([\s\S]*?)(?=\[CHARGES\]|$)/);
  const chargesMatch = raw.match(/\[CHARGES\]([\s\S]*?)(?=\[FIXED\]|$)/);
  const fixedMatch = raw.match(/\[FIXED\]([\s\S]*?)$/);

  const roast = roastMatch ? roastMatch[1].trim() : '';
  const chargesRaw = chargesMatch ? chargesMatch[1].trim() : '';
  const fixed = fixedMatch ? fixedMatch[1].trim() : '';

  const charges = chargesRaw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('✗'));

  return { roast, charges, fixed };
}

export async function saveRoast(
  originalPrompt: string,
  result: RoastResult,
  userId: string | null
): Promise<string> {
  const ref = await addDoc(collection(db, 'roasts'), {
    userId,
    originalPrompt,
    roast: result.roast,
    charges: result.charges,
    fixed: result.fixed,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function roastPrompt(prompt: string, sessionRoastCount: number): Promise<ReadableStream> {
  void sessionRoastCount;

  if (!prompt.trim()) {
    throw new Error('Prompt cannot be empty.');
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      let raw = '';

      try {
        const stream = await client.messages.stream({
          model: 'claude-haiku-4-5',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: `Prompt to roast:\n${prompt}` }],
        });

        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            raw += chunk.delta.text;
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }

        // Send parsed result as final JSON event
        const parsed = parseRoastOutput(raw);
        controller.enqueue(
          encoder.encode(`\n\n__PARSED__${JSON.stringify(parsed)}`)
        );
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
