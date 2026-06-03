'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Button, Divider, Tooltip, Typography } from '@mui/material';
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
    await navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {shareUrl && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title={shareCopied ? 'Link copied!' : 'Copy share link'}>
            <Button
              size="small"
              startIcon={shareCopied ? <CheckIcon /> : <ShareIcon />}
              onClick={handleShare}
              aria-label="Share this roast"
            >
              {shareCopied ? 'Copied!' : 'Share'}
            </Button>
          </Tooltip>
        </Box>
      )}

      <Section label="The Roast">
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
          {doc.roast}
        </Typography>
      </Section>

      <Divider />

      <Section label="Charges">
        <Box component="ul" sx={{ m: 0, pl: 2 }}>
          {doc.charges.map((charge, i) => (
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
          <Tooltip title={copied ? 'Copied!' : 'Copy fixed prompt'}>
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
          {doc.fixed}
        </Typography>
      </Section>

      <Divider />

      <Box sx={{ textAlign: 'center', pt: 2 }}>
        <Button component={Link} href="/" variant="contained" size="large">
          Roast your own prompt →
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
