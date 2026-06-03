import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoastCard from '../components/RoastCard';
import type { RoastDocument } from '../lib/types';

const mockDoc: RoastDocument = {
  id: 'abc123',
  userId: null,
  originalPrompt: 'Write me a poem.',
  roast: 'This prompt is catastrophically lazy.',
  charges: ['✗ Vague: No subject specified.'],
  fixed: 'Write a 14-line Shakespearean sonnet about autumn leaves.',
  createdAt: 1700000000000,
};

describe('RoastCard', () => {
  it('renders roast, charges, and fixed sections', () => {
    render(<RoastCard doc={mockDoc} />);
    expect(screen.getByText(/catastrophically lazy/i)).toBeInTheDocument();
    expect(screen.getByText(/Vague/i)).toBeInTheDocument();
    expect(screen.getByText(/Shakespearean sonnet/i)).toBeInTheDocument();
  });

  it('renders a CTA link back to the homepage', () => {
    render(<RoastCard doc={mockDoc} />);
    expect(screen.getByRole('link', { name: /roast your own/i })).toBeInTheDocument();
  });

  it('copies share URL to clipboard when share button is clicked', async () => {
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
    render(<RoastCard doc={mockDoc} shareUrl="https://example.com/roast/abc123" />);
    await userEvent.click(screen.getByRole('button', { name: /share/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/roast/abc123');
  });
});
