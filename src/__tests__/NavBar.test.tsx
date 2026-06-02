import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavBar from '../components/NavBar';

const mockSignIn = jest.fn();
const mockSignOut = jest.fn();

jest.mock('../lib/useAuth', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../lib/useAuth';
const mockUseAuth = useAuth as jest.Mock;

describe('NavBar', () => {
  it('shows Sign in button when signed out', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, signIn: mockSignIn, signOut: mockSignOut });
    render(<NavBar />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls signIn when Sign in button is clicked', async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, signIn: mockSignIn, signOut: mockSignOut });
    render(<NavBar />);
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('shows avatar and history link when signed in', () => {
    mockUseAuth.mockReturnValue({
      user: { displayName: 'Alex', email: 'alex@example.com', photoURL: null },
      loading: false,
      signIn: mockSignIn,
      signOut: mockSignOut,
    });
    render(<NavBar />);
    expect(screen.getByRole('link', { name: /history/i })).toBeInTheDocument();
  });

  it('calls signOut when sign out is triggered', async () => {
    mockUseAuth.mockReturnValue({
      user: { displayName: 'Alex', email: 'alex@example.com', photoURL: null },
      loading: false,
      signIn: mockSignIn,
      signOut: mockSignOut,
    });
    render(<NavBar />);
    await userEvent.click(screen.getByRole('button', { name: /sign out/i }));
    expect(mockSignOut).toHaveBeenCalled();
  });
});
