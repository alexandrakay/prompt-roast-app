'use client';

import { useState } from 'react';
import { Box, Button, Divider, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import type { RoastResult } from '@/lib/types';

interface Props {
  streamedText: string;
  result: RoastResult | null;
}

export default function RoastResultView({ streamedText, result }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!result?.fixed) return;
    await navigator.clipboard.writeText(result.fixed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (result) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          mt: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'rgba(8, 6, 7, 0.68)',
        }}
      >
        <Section label="The Verdict">
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.85,
              fontFamily: 'var(--font-instrument-serif)',
              fontStyle: 'italic',
              fontSize: { xs: '1.25rem', sm: '1.45rem' },
              color: 'text.primary',
            }}
          >
            {result.roast}
          </Typography>
        </Section>

        <Divider />

        <Section label="The Charges">
          <Box component="ol" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {result.charges.map((charge, i) => (
              <Box
                key={i}
                component="li"
                sx={{
                  listStyle: 'none',
                  display: 'grid',
                  gridTemplateColumns: '2rem 1fr',
                  gap: 1.5,
                  alignItems: 'start',
                }}
              >
                <Typography
                  aria-hidden
                  sx={{
                    width: 28,
                    height: 28,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'background.default',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                  }}
                >
                  {i + 1}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                  {charge}
                </Typography>
              </Box>
            ))}
          </Box>
        </Section>

        <Divider />

        <Section
          label="The Rewrite"
          action={
            <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
              <Button
                size="small"
                startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                onClick={handleCopy}
                aria-label="Copy fixed prompt"
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </Tooltip>
          }
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              bgcolor: 'background.paper',
              p: { xs: 2, sm: 2.5 },
              borderRadius: 0,
              border: '1px solid',
              borderColor: 'rgba(244, 255, 82, 0.35)',
              lineHeight: 1.75,
            }}
          >
            {result.fixed}
          </Typography>
        </Section>
      </Box>
    );
  }

  return (
    <Box data-testid="streaming-text-container" sx={{ mt: 3, border: '1px solid', borderColor: 'divider', p: 2, bgcolor: 'background.paper' }}>
      <Typography
        variant="body2"
        sx={{ whiteSpace: 'pre-wrap', color: 'text.primary', fontFamily: 'monospace', lineHeight: 1.7 }}
      >
        {streamedText}
      </Typography>
    </Box>
  );
}

function Section({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2 }}>
        <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 900, letterSpacing: 0 }}>
          {label}
        </Typography>
        {action}
      </Box>
      {children}
    </Box>
  );
}
