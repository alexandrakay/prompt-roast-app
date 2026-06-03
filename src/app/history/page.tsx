'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
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

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [roasts, setRoasts] = useState<RoastDocument[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/');
      return;
    }

    const q = query(collection(db, 'roasts'), where('userId', '==', user.uid));
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
        docs.sort((a, b) => b.createdAt - a.createdAt);
        setRoasts(docs);
      })
      .catch(() => setError(true))
      .finally(() => setFetching(false));
  }, [user, authLoading, router]);

  function handleDelete(id: string) {
    setRoasts((prev) => prev.filter((r) => r.id !== id));
    deleteDoc(doc(db, 'roasts', id));
  }

  if (authLoading || fetching) {
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
          'radial-gradient(circle at 85% 0%, rgba(244, 255, 82, 0.1), transparent 28%), #080607',
        py: { xs: 6, sm: 10 },
      }}
    >
      <Container maxWidth="md">
        <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 0, fontWeight: 900 }}>
          Private receipts
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, textTransform: 'uppercase', letterSpacing: 0 }}>
          Your Roast History
        </Typography>

        {roasts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No roasts yet. Paste a prompt and take the heat.
            </Typography>
            <Button component={Link} href="/" variant="contained">
              Roast a prompt
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid', borderColor: 'divider' }}>
            {roasts.map((roast, i) => (
              <Box key={roast.id}>
                {i > 0 && <Divider />}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    py: 3,
                    px: { xs: 0, sm: 2 },
                    borderLeft: { sm: '3px solid transparent' },
                    '&:hover': {
                      bgcolor: 'rgba(244, 255, 82, 0.05)',
                      borderLeftColor: 'secondary.main',
                    },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      component={Link}
                      href={`/roast/${roast.id}`}
                      sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          color: 'text.secondary',
                          mb: 0.75,
                          fontSize: '0.75rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {truncate(roast.originalPrompt, 100)}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800, mb: 0.75, lineHeight: 1.5 }}>
                        {truncate(roast.roast.split(/[.!?]/)[0] ?? roast.roast, 120)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, textTransform: 'uppercase' }}>
                      {relativeTime(roast.createdAt)}
                    </Typography>
                  </Box>
                  <Tooltip title="Delete this roast">
                    <IconButton
                      size="small"
                      aria-label="Delete"
                      onClick={() => handleDelete(roast.id)}
                      sx={{ color: 'text.disabled', flexShrink: 0 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
