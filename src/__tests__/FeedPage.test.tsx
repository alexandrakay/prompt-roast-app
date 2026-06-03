import { render, screen, waitFor } from '@testing-library/react';

const mockGetDocs = jest.fn();
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
}));
jest.mock('../lib/firebase', () => ({ db: {} }));

import FeedPage from '../app/feed/page';

const fakeRoast = {
  id: 'r1',
  userId: null,
  originalPrompt: 'Write me a poem about the moon.',
  roast: 'This prompt is laughably vague and painfully generic.',
  charges: ['✗ Vague'],
  fixed: 'Write a haiku about a crescent moon at midnight.',
  createdAt: Date.now() - 60000,
};

function makeSnapshot(docs: typeof fakeRoast[]) {
  return {
    docs: docs.map((d) => ({
      id: d.id,
      data: () => ({ ...d, createdAt: { toMillis: () => d.createdAt } }),
    })),
  };
}

describe('FeedPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders roast entries from Firestore', async () => {
    mockGetDocs.mockResolvedValue(makeSnapshot([fakeRoast]));
    render(<FeedPage />);
    await waitFor(() =>
      expect(screen.getByText(/laughably vague/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Write me a poem/i)).toBeInTheDocument();
  });

  it('each entry links to its /roast/[id] page', async () => {
    mockGetDocs.mockResolvedValue(makeSnapshot([fakeRoast]));
    render(<FeedPage />);
    await waitFor(() => screen.getByText(/laughably vague/i));
    const link = screen.getByRole('link', { name: /laughably vague/i });
    expect(link).toHaveAttribute('href', '/roast/r1');
  });

  it('shows an empty state when there are no roasts', async () => {
    mockGetDocs.mockResolvedValue(makeSnapshot([]));
    render(<FeedPage />);
    await waitFor(() =>
      expect(screen.getByText(/no roasts yet/i)).toBeInTheDocument()
    );
  });
});
