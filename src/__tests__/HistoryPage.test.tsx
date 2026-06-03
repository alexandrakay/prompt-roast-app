import { render, screen, waitFor, fireEvent } from '@testing-library/react';

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const mockGetDocs = jest.fn();
const mockDeleteDoc = jest.fn().mockResolvedValue(undefined);
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
  doc: jest.fn(),
}));
jest.mock('../lib/firebase', () => ({ db: {} }));

const mockUseAuth = jest.fn();
jest.mock('../lib/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

import HistoryPage from '../app/history/page';

const fakeRoast = {
  id: 'r1',
  userId: 'u1',
  originalPrompt: 'Write me a poem about the moon.',
  roast: 'This prompt is laughably vague.',
  charges: ['✗ Vague'],
  fixed: 'Write a haiku about a crescent moon.',
  createdAt: Date.now() - 60000,
};

function makeSnapshot(docs: typeof fakeRoast[]) {
  return { docs: docs.map((d) => ({ id: d.id, data: () => ({ ...d, createdAt: { toMillis: () => d.createdAt } }) })) };
}

describe('HistoryPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('redirects to / when user is not signed in', async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    mockGetDocs.mockResolvedValue(makeSnapshot([]));
    render(<HistoryPage />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'));
  });

  it('renders roast history for a signed-in user', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'u1' }, loading: false });
    mockGetDocs.mockResolvedValue(makeSnapshot([fakeRoast]));
    render(<HistoryPage />);
    await waitFor(() =>
      expect(screen.getByText(/laughably vague/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Write me a poem/i)).toBeInTheDocument();
  });

  it('removes a roast from the list when delete is clicked', async () => {
    mockUseAuth.mockReturnValue({ user: { uid: 'u1' }, loading: false });
    mockGetDocs.mockResolvedValue(makeSnapshot([fakeRoast]));
    render(<HistoryPage />);
    await waitFor(() => screen.getByText(/laughably vague/i));
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockDeleteDoc).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.queryByText(/laughably vague/i)).not.toBeInTheDocument()
    );
  });
});
