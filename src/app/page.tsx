'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Button, Container, Tooltip, Typography } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import CheckIcon from '@mui/icons-material/Check';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RoastForm from '@/components/RoastForm';
import { useAuth } from '@/lib/useAuth';
import type { RoastResult } from '@/lib/types';

const ANON_ROAST_LIMIT = 3;

export default function Home() {
  const { user, signIn } = useAuth();
  const [sessionRoastCount, setSessionRoastCount] = useState(0);
  const [lastRoastId, setLastRoastId] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const isGated = !user && sessionRoastCount >= ANON_ROAST_LIMIT;

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
        background:
          'radial-gradient(circle at 20% 0%, rgba(255, 61, 31, 0.18), transparent 28%), linear-gradient(135deg, rgba(244, 255, 82, 0.08) 0 1px, transparent 1px 18px), #080607',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 5, sm: 8 },
        pb: 10,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: { xs: 4, sm: 6 }, borderBottom: '1px solid', borderColor: 'divider', pb: { xs: 5, sm: 7 } }}>
          <Typography
            variant="overline"
            sx={{
              color: 'secondary.main',
              display: 'block',
              mb: 2,
              letterSpacing: 0,
              fontWeight: 900,
            }}
          >
            Brutal feedback. Better prompts.
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 900,
              fontSize: { xs: '3.2rem', sm: '5.3rem', md: '7rem' },
              lineHeight: 0.9,
              letterSpacing: 0,
              mb: 3,
              textTransform: 'uppercase',
            }}
          >
            Prompt
            <br />
            <Box
              component="span"
              sx={{
                fontFamily: 'var(--font-instrument-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                textTransform: 'none',
                color: 'primary.main',
                textShadow: '0 0 28px rgba(255, 61, 31, 0.45)',
              }}
            >
              Roast
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '42ch', fontSize: { xs: '0.95rem', sm: '1.05rem' }, lineHeight: 1.7 }}
          >
            Paste the prompt you&apos;ve been pretending is fine. We&apos;ll drag the weak spots, file the charges, and hand you back the version that actually works.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            p: { xs: 2, sm: 3 },
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'rgba(21, 16, 16, 0.82)',
            boxShadow: { sm: '10px 10px 0 #000000' },
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '-1px -1px auto -1px',
              height: 3,
              background: 'linear-gradient(90deg, #ff3d1f, #f4ff52, #ff3d1f)',
            },
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', display: 'block', mb: 2, letterSpacing: 0 }}
          >
            Enter the prompt
          </Typography>
          <RoastForm
            sessionRoastCount={sessionRoastCount}
            userId={user?.uid ?? null}
            onRoastComplete={handleRoastComplete}
            gated={isGated}
            onSignIn={signIn}
          />
        </Box>

        {lastRoastId && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href={`/roast/${lastRoastId}`}
              variant="contained"
              startIcon={<OpenInNewIcon />}
            >
              View your roast
            </Button>
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
