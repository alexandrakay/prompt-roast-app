'use client';

import { useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { roastPrompt, saveRoast } from '@/app/actions';
import type { RoastResult } from '@/lib/types';
import RoastResultView from './RoastResult';

export interface RoastFormProps {
  sessionRoastCount: number;
  userId?: string | null;
  onRoastComplete: (result: RoastResult, roastId: string) => void;
  gated?: boolean;
  onSignIn?: () => void;
}

export default function RoastForm({ sessionRoastCount, userId = null, onRoastComplete, gated = false, onSignIn }: RoastFormProps) {
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
            saveRoast(prompt, parsed, userId ?? null)
              .then((id) => onRoastComplete(parsed, id))
              .catch(() => onRoastComplete(parsed, ''));
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
        minRows={6}
        maxRows={12}
        fullWidth
        placeholder="Paste the prompt. Leave the dignity."
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          if (error) setError('');
        }}
        error={!!error}
        helperText={error || ' '}
        disabled={loading || gated}
        slotProps={{ htmlInput: { 'aria-label': 'Prompt input' } }}
        sx={{
          '& textarea': {
            fontSize: { xs: '0.98rem', sm: '1.05rem' },
            lineHeight: 1.7,
          },
        }}
      />

      {gated ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            py: 3,
            px: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'primary.main',
            textAlign: 'center',
            boxShadow: { sm: '8px 8px 0 #000000' },
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            You&apos;ve taken enough free heat.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to keep the roast line open.
          </Typography>
          <Button variant="contained" onClick={onSignIn}>
            Sign in
          </Button>
        </Box>
      ) : (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ alignSelf: 'flex-end', minWidth: 156, py: 1.2 }}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <LocalFireDepartmentIcon />}
        >
          {loading ? 'Roasting...' : 'Light it up'}
        </Button>
      )}

      {(streamedText || result) && (
        <RoastResultView streamedText={streamedText} result={result} />
      )}
    </Box>
  );
}
