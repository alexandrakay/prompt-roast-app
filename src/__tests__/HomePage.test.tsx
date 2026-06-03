import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockUseAuth = jest.fn();
jest.mock('../lib/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('../components/NavBar', () => ({
  __esModule: true,
  default: () => <nav />,
}));

jest.mock('../components/RoastForm', () => ({
  __esModule: true,
  default: ({ onRoastComplete }: { onRoastComplete: (result: object, roastId: string) => void }) => (
    <button onClick={() => onRoastComplete({}, 'test-roast-id')}>Trigger Roast</button>
  ),
}));

const mockUpdateDoc = jest.fn().mockResolvedValue(undefined);
const mockDoc = jest.fn().mockReturnValue({ id: 'mock-ref' });
jest.mock('firebase/firestore', () => ({
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
}));
jest.mock('../lib/firebase', () => ({ db: {} }));

import Home from '../app/page';

const anonAuth = { user: null, loading: false, signIn: jest.fn(), signOut: jest.fn() };
const signedInAuth = { user: { uid: 'u1' }, loading: false, signIn: jest.fn(), signOut: jest.fn() };

describe('Home page post-roast actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(anonAuth);
  });

  it('shows a link to the roast page after roast completes', async () => {
    render(<Home />);
    await userEvent.click(screen.getByText('Trigger Roast'));
    const link = screen.getByRole('link', { name: /view.*roast/i });
    expect(link).toHaveAttribute('href', '/roast/test-roast-id');
  });

  it('does not show the roast link before a roast completes', () => {
    render(<Home />);
    expect(screen.queryByRole('link', { name: /view.*roast/i })).not.toBeInTheDocument();
  });

  it('claims anonymous session roasts when the user signs in', async () => {
    const { rerender } = render(<Home />);

    await userEvent.click(screen.getByText('Trigger Roast'));

    await act(async () => {
      mockUseAuth.mockReturnValue(signedInAuth);
      rerender(<Home />);
    });

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      expect.anything(),
      { userId: 'u1' },
    );
  });

  it('does not claim roasts made while already signed in', async () => {
    mockUseAuth.mockReturnValue(signedInAuth);
    render(<Home />);
    await userEvent.click(screen.getByText('Trigger Roast'));

    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });
});
