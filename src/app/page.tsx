'use client';

import { useState } from 'react';
import { Box, Button, Container, Tooltip, Typography } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import CheckIcon from '@mui/icons-material/Check';
import RoastForm from '@/components/RoastForm';
import { useAuth } from '@/lib/useAuth';
import type { RoastResult } from '@/lib/types';

export default function Home() {
  const { user } = useAuth();
  const [sessionRoastCount, setSessionRoastCount] = useState(0);
  const [lastRoastId, setLastRoastId] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  function handleRoastComplete(_result: RoastResult, roastId: string) {
    setSessionRoastCount((c) => c + 1);
    setLastRoastId(roastId || null);
  }

  async function handleShare() {
    if (!lastRoastId) return;
    const url = `${window.location.origin}/roast/${lastRoastId}`;
    await navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 6, sm: 10 },
        pb: 10,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, letterSpacing: '-0.03em', mb: 1 }}
          >
            Prompt Roast
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Paste your prompt. Get it torn apart. Walk away better.
          </Typography>
        </Box>

        <RoastForm
          sessionRoastCount={sessionRoastCount}
          userId={user?.uid ?? null}
          onRoastComplete={handleRoastComplete}
        />

        {lastRoastId && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Tooltip title={shareCopied ? 'Link copied!' : 'Copy shareable link'}>
              <Button
                variant="outlined"
                startIcon={shareCopied ? <CheckIcon /> : <ShareIcon />}
                onClick={handleShare}
              >
                {shareCopied ? 'Copied!' : 'Share this roast'}
              </Button>
            </Tooltip>
          </Box>
        )}
      </Container>
    </Box>
  );
}
