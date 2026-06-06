import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoastForm from '../components/RoastForm';

jest.mock('../app/actions', () => ({
  roastPrompt: jest.fn(),
  saveRoast: jest.fn().mockResolvedValue('mock-id'),
}));

describe('RoastForm', () => {
  it('blocks empty submission and shows an error', async () => {
    render(<RoastForm sessionRoastCount={0} onRoastComplete={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /light it up/i }));
    expect(screen.getByText(/prompt cannot be empty/i)).toBeInTheDocument();
  });

  it('renders a textarea and submit button', () => {
    render(<RoastForm sessionRoastCount={0} onRoastComplete={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /light it up/i })).toBeInTheDocument();
  });

  it('disables form and shows sign-in prompt when gated', () => {
    render(
      <RoastForm
        sessionRoastCount={3}
        onRoastComplete={() => {}}
        gated
        onSignIn={() => {}}
      />
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('calls onSignIn when the sign-in button is clicked while gated', async () => {
    const onSignIn = jest.fn();
    render(
      <RoastForm
        sessionRoastCount={3}
        onRoastComplete={() => {}}
        gated
        onSignIn={onSignIn}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it('does not gate signed-in users regardless of roast count', () => {
    render(
      <RoastForm
        sessionRoastCount={10}
        onRoastComplete={() => {}}
        gated={false}
      />
    );
    expect(screen.getByRole('textbox')).not.toBeDisabled();
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
  });

  describe('stream error handling', () => {
    it('shows an error message when the roast action rejects', async () => {
      const { roastPrompt } = jest.requireMock('../app/actions');
      roastPrompt.mockRejectedValueOnce(new Error('Network error'));

      render(<RoastForm sessionRoastCount={0} onRoastComplete={() => {}} />);
      await userEvent.type(screen.getByRole('textbox'), 'my prompt');
      await userEvent.click(screen.getByRole('button', { name: /light it up/i }));

      expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    });

    it('shows a retry button after a stream error', async () => {
      const { roastPrompt } = jest.requireMock('../app/actions');
      roastPrompt.mockRejectedValueOnce(new Error('Network error'));

      render(<RoastForm sessionRoastCount={0} onRoastComplete={() => {}} />);
      await userEvent.type(screen.getByRole('textbox'), 'my prompt');
      await userEvent.click(screen.getByRole('button', { name: /light it up/i }));

      expect(await screen.findByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('re-enables the submit button after a stream error', async () => {
      const { roastPrompt } = jest.requireMock('../app/actions');
      roastPrompt.mockRejectedValueOnce(new Error('Network error'));

      render(<RoastForm sessionRoastCount={0} onRoastComplete={() => {}} />);
      await userEvent.type(screen.getByRole('textbox'), 'my prompt');
      await userEvent.click(screen.getByRole('button', { name: /light it up/i }));

      await screen.findByText(/network error/i);
      expect(screen.getByRole('button', { name: /light it up/i })).not.toBeDisabled();
    });

    it('preserves the original prompt after a stream error', async () => {
      const { roastPrompt } = jest.requireMock('../app/actions');
      roastPrompt.mockRejectedValueOnce(new Error('Network error'));

      render(<RoastForm sessionRoastCount={0} onRoastComplete={() => {}} />);
      await userEvent.type(screen.getByRole('textbox'), 'my original prompt');
      await userEvent.click(screen.getByRole('button', { name: /light it up/i }));

      await screen.findByText(/network error/i);
      expect(screen.getByRole('textbox')).toHaveValue('my original prompt');
    });
  });
});
