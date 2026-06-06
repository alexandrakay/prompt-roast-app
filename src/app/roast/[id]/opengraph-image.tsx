import { ImageResponse } from 'next/og';
import { getRoast } from '@/lib/getRoast';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const doc = await getRoast(id).catch(() => null);

  const roastText = doc
    ? (doc.roast.split(/(?<=[.!?])\s/)[0] ?? doc.roast).slice(0, 160)
    : 'Get your AI prompts brutally critiqued and rewritten.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#080607',
          padding: '60px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #ff3d1f, #f4ff52, #ff3d1f)',
          }}
        />

        {/* wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
            Prompt Roast
          </span>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ff3d1f' }} />
        </div>

        {/* roast text */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            paddingTop: 40,
            paddingBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: roastText.length > 100 ? 42 : 52,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.25,
              fontStyle: 'italic',
            }}
          >
            {roastText}
          </span>
        </div>

        {/* bottom label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: '#ff3d1f',
            }}
          />
          <span style={{ fontSize: 18, color: '#666666', letterSpacing: '0.05em' }}>
            prompt-roast.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
