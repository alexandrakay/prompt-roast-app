import { notFound } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';
import type { Metadata } from 'next';
import { getRoast } from '@/lib/getRoast';
import RoastCard from '@/components/RoastCard';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doc = await getRoast(id);
  if (!doc) return { title: 'Roast not found — Prompt Roast' };

  const firstSentence = doc.roast.split(/[.!?]/)[0]?.trim() ?? 'Get roasted.';
  return {
    title: `${firstSentence} — Prompt Roast`,
    description: doc.originalPrompt,
    openGraph: {
      title: firstSentence,
      description: doc.originalPrompt,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: firstSentence,
      description: doc.originalPrompt,
    },
  };
}

export default async function RoastPage({ params }: Props) {
  const { id } = await params;
  const doc = await getRoast(id);

  if (!doc) notFound();

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/roast/${id}`;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 6, sm: 10 } }}>
      <Container maxWidth="md">
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', display: 'block', mb: 3 }}
        >
          Prompt Roast
        </Typography>
        <RoastCard doc={doc} shareUrl={shareUrl} />
      </Container>
    </Box>
  );
}
