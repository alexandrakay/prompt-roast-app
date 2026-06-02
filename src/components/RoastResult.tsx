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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
        <Section label="The Roast">
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {result.roast}
          </Typography>
        </Section>

        <Divider />

        <Section label="Charges">
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {result.charges.map((charge, i) => (
              <Typography key={i} component="li" variant="body2" sx={{ mb: 0.5 }}>
                {charge}
              </Typography>
            ))}
          </Box>
        </Section>

        <Divider />

        <Section
          label="Fixed Prompt"
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
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {result.fixed}
          </Typography>
        </Section>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="body2"
        sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary', fontFamily: 'monospace' }}
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
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
          {label}
        </Typography>
        {action}
      </Box>
      {children}
    </Box>
  );
}
