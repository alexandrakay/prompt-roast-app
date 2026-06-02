'use client';

import { useState } from 'react';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { roastPrompt } from '@/app/actions';
import type { RoastResult } from '@/lib/types';
import RoastResultView from './RoastResult';

export interface RoastFormProps {
  sessionRoastCount: number;
  onRoastComplete: (result: RoastResult) => void;
}

export default function RoastForm({ sessionRoastCount, onRoastComplete }: RoastFormProps) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [result, setResult] = useState<RoastResult | null>(null);

  async function handleSubmit() {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }
    setError('');
    setLoading(true);
    setStreamedText('');
    setResult(null);

    try {
      const stream = await roastPrompt(prompt, sessionRoastCount);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let raw = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        const parsedMarker = '\n\n__PARSED__';
        if (chunk.includes(parsedMarker)) {
          const [text, jsonPart] = chunk.split(parsedMarker);
          raw += text;
          setStreamedText(raw);
          try {
            const parsed: RoastResult = JSON.parse(jsonPart);
            setResult(parsed);
            onRoastComplete(parsed);
          } catch {}
        } else {
          raw += chunk;
          setStreamedText(raw);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        multiline
        minRows={4}
        maxRows={12}
        fullWidth
        placeholder="Paste your prompt here…"
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          if (error) setError('');
        }}
        error={!!error}
        helperText={error || ' '}
        disabled={loading}
        slotProps={{ htmlInput: { 'aria-label': 'Prompt input' } }}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ alignSelf: 'flex-end', minWidth: 120 }}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {loading ? 'Roasting…' : 'Roast it'}
      </Button>

      {(streamedText || result) && (
        <RoastResultView streamedText={streamedText} result={result} />
      )}
    </Box>
  );
}
