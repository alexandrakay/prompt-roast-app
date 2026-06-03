import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('../lib/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false, signIn: jest.fn(), signOut: jest.fn() }),
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

import Home from '../app/page';

describe('Home page post-roast actions', () => {
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
});
