jest.mock('../lib/getRoast', () => ({
  getRoast: jest.fn(),
}));

jest.mock('next/og', () => ({
  ImageResponse: class ImageResponse {
    readonly ok = true;
    readonly status = 200;
    constructor(_element: unknown, _options?: unknown) {}
  },
}));

jest.mock('../lib/firebase', () => ({ db: {} }));

import { getRoast } from '../lib/getRoast';

const mockRoast = {
  id: 'abc',
  userId: null,
  originalPrompt: 'Write me a story',
  roast: 'This prompt is the literary equivalent of asking someone to hand you a pen and expecting a Pulitzer.',
  charges: ['✗ Vague: No genre, length, or tone specified.'],
  fixed: 'Write a 500-word short story in the style of Raymond Carver.',
  createdAt: 0,
};

describe('RoastOgImage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns a Response when a valid roast id is given', async () => {
    (getRoast as jest.Mock).mockResolvedValue(mockRoast);
    const { default: Image } = await import('../app/roast/[id]/opengraph-image');
    const result = await Image({ params: Promise.resolve({ id: 'abc' }) });
    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
  });

  it('returns a response even when the roast is not found (fallback)', async () => {
    (getRoast as jest.Mock).mockResolvedValue(null);
    const { default: Image } = await import('../app/roast/[id]/opengraph-image');
    const result = await Image({ params: Promise.resolve({ id: 'missing' }) });
    expect(result).toBeDefined();
    expect(result.ok).toBe(true);
  });
});
