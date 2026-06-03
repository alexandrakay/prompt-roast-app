'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, CircularProgress, Container, Divider, Typography } from '@mui/material';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { RoastDocument } from '@/lib/types';

function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '…';
}

export default function FeedPage() {
  const [roasts, setRoasts] = useState<RoastDocument[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'roasts'), orderBy('createdAt', 'desc'), limit(20));
    getDocs(q)
      .then((snap) => {
        const docs: RoastDocument[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: data.userId ?? null,
            originalPrompt: data.originalPrompt,
            roast: data.roast,
            charges: data.charges,
            fixed: data.fixed,
            createdAt: data.createdAt?.toMillis?.() ?? data.createdAt ?? 0,
          };
        });
        setRoasts(docs);
      })
      .catch(() => setError(true))
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
        <Typography color="text.secondary">Something went wrong — try refreshing.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        background:
          'radial-gradient(circle at 85% 0%, rgba(255, 61, 31, 0.14), transparent 30%), #080607',
        py: { xs: 6, sm: 10 },
      }}
    >
      <Container maxWidth="md">
        <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 0, fontWeight: 900 }}>
          Public evidence
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, textTransform: 'uppercase', letterSpacing: 0 }}>
          Burn Book
        </Typography>

        {roasts.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
            No roasts yet. Be the first to take the heat.
          </Typography>
        ) : (
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            {roasts.map((roast, i) => (
              <Box key={roast.id}>
                {i > 0 && <Divider />}
                <Box
                  component={Link}
                  href={`/roast/${roast.id}`}
                  sx={{
                    display: 'block',
                    py: 3,
                    px: { xs: 0, sm: 2 },
                    textDecoration: 'none',
                    color: 'inherit',
                    borderLeft: { sm: '3px solid transparent' },
                    '&:hover': {
                      bgcolor: 'rgba(255, 61, 31, 0.07)',
                      borderLeftColor: 'primary.main',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', color: 'text.secondary', mb: 0.75, fontSize: '0.75rem', lineHeight: 1.6 }}
                  >
                    {truncate(roast.originalPrompt, 100)}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, mb: 0.75, lineHeight: 1.5 }}>
                    {truncate(roast.roast.split(/[.!?]/)[0] ?? roast.roast, 120)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, textTransform: 'uppercase' }}>
                    {relativeTime(roast.createdAt)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
