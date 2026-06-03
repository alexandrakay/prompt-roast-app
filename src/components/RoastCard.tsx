'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { RoastDocument } from '@/lib/types';

interface Props {
  doc: RoastDocument;
  shareUrl?: string;
}

export default function RoastCard({ doc, shareUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(doc.fixed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (!shareUrl) return;
    const fullUrl = shareUrl.startsWith('http') ? shareUrl : `${window.location.origin}${shareUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  const firstSentence = doc.roast.split(/(?<=[.!?])\s/)[0] ?? '';
  const remainder = doc.roast.slice(firstSentence.length).trim();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {shareUrl && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Tooltip title={shareCopied ? 'Link copied!' : 'Copy share link'}>
            <Button
              size="small"
              startIcon={shareCopied ? <CheckIcon /> : <ShareIcon />}
              onClick={handleShare}
              aria-label="Share this roast"
              sx={{ letterSpacing: '0.05em', fontSize: '0.75rem' }}
            >
              {shareCopied ? 'Copied!' : 'Share'}
            </Button>
          </Tooltip>
        </Box>
      )}

      <Section label="The Verdict">
        <Typography
          component="p"
          sx={{
            fontFamily: 'var(--font-instrument-serif)',
            fontStyle: 'italic',
            fontSize: { xs: '1.4rem', sm: '1.75rem' },
            lineHeight: 1.3,
            mb: remainder ? 2 : 0,
            color: 'text.primary',
            textShadow: '0 0 24px rgba(255, 61, 31, 0.22)',
          }}
        >
          {firstSentence}
        </Typography>
        {remainder && (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.secondary' }}>
            {remainder}
          </Typography>
        )}
      </Section>

      <Section label="The Charges">
        <Box component="ol" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {doc.charges.map((charge, i) => (
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

      <Section
        label="The Rewrite"
        action={
          <Tooltip title={copied ? 'Copied!' : 'Copy fixed prompt'}>
            <Button
              size="small"
              startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
              onClick={handleCopy}
              aria-label="Copy fixed prompt"
              sx={{ letterSpacing: '0.05em', fontSize: '0.75rem' }}
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
            border: '1px solid',
            borderColor: 'rgba(244, 255, 82, 0.35)',
            borderRadius: 0,
            fontSize: '0.82rem',
            lineHeight: 1.7,
          }}
        >
          {doc.fixed}
        </Typography>
      </Section>

      <Box sx={{ pt: 6, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
        <Button component={Link} href="/" variant="contained" size="large" sx={{ px: 4 }}>
          Roast your own prompt
        </Button>
      </Box>
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
    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 4, pb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          variant="overline"
          sx={{
            color: 'secondary.main',
            letterSpacing: 0,
            fontSize: '0.65rem',
            fontWeight: 900,
          }}
        >
          {label}
        </Typography>
        {action}
      </Box>
      {children}
    </Box>
  );
}
