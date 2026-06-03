'use client';

import Link from 'next/link';
import { Box, Button, Container, Divider, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const steps = [
  {
    label: 'Install',
    command: 'npm install -g prompt-roast',
    description: 'Install the CLI globally — one time, any machine.',
  },
  {
    label: 'Run',
    command: 'roast',
    description: 'Run the command. Paste your prompt when asked. Get roasted.',
  },
];

export default function CliPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        background:
          'radial-gradient(circle at 15% 0%, rgba(255, 61, 31, 0.12), transparent 28%), #080607',
        py: { xs: 6, sm: 10 },
      }}
    >
      <Container maxWidth="md">
        <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 0, fontWeight: 900 }}>
          Terminal edition
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, textTransform: 'uppercase', letterSpacing: 0 }}>
          CLI
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: '52ch', lineHeight: 1.7 }}>
          Prefer the terminal? The{' '}
          <Box component="span" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>prompt-roast</Box>{' '}
          CLI brings the same brutal feedback to your command line.
          Two commands. Zero context-switching.
        </Typography>

        <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          {steps.map((step, i) => (
            <Box key={step.label}>
              {i > 0 && <Divider />}
              <Box sx={{ py: 4, px: { xs: 0, sm: 2 } }}>
                <Typography
                  variant="overline"
                  sx={{ color: 'primary.main', fontWeight: 900, letterSpacing: 0, display: 'block', mb: 1 }}
                >
                  Step {i + 1} — {step.label}
                </Typography>
                <Box
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    bgcolor: 'rgba(255,255,255,0.04)',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 0,
                    px: 2.5,
                    py: 1.5,
                    mb: 1.5,
                    letterSpacing: '0.02em',
                    color: 'secondary.main',
                    display: 'inline-block',
                    minWidth: 280,
                  }}
                >
                  $ {step.command}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            component={Link}
            href="https://www.npmjs.com/package/prompt-roast"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            endIcon={<OpenInNewIcon />}
            aria-label="View on npm"
          >
            View on npm
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
