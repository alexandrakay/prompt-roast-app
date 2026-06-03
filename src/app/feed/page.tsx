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
      .finally(() => setFetching(false));
  }, []);

  if (fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 6, sm: 10 } }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
          Recent Roasts
        </Typography>

        {roasts.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
            No roasts yet. Be the first.
          </Typography>
        ) : (
          <Box>
            {roasts.map((roast, i) => (
              <Box key={roast.id}>
                {i > 0 && <Divider />}
                <Box
                  component={Link}
                  href={`/roast/${roast.id}`}
                  sx={{
                    display: 'block',
                    py: 3,
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': { opacity: 0.8 },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', color: 'text.secondary', mb: 0.5, fontSize: '0.75rem' }}
                  >
                    {truncate(roast.originalPrompt, 100)}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {truncate(roast.roast.split(/[.!?]/)[0] ?? roast.roast, 120)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
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
