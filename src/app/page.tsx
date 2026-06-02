'use client';

import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import RoastForm from '@/components/RoastForm';
import type { RoastResult } from '@/lib/types';

export default function Home() {
  const [sessionRoastCount, setSessionRoastCount] = useState(0);

  function handleRoastComplete(_result: RoastResult) {
    setSessionRoastCount((c) => c + 1);
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
          onRoastComplete={handleRoastComplete}
        />
      </Container>
    </Box>
  );
}
