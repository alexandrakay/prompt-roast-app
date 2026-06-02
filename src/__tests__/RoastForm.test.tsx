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
    await userEvent.click(screen.getByRole('button', { name: /roast/i }));
    expect(screen.getByText(/prompt cannot be empty/i)).toBeInTheDocument();
  });

  it('renders a textarea and submit button', () => {
    render(<RoastForm sessionRoastCount={0} onRoastComplete={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /roast/i })).toBeInTheDocument();
  });
});
