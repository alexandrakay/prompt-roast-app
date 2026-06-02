import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoastResultView from '../components/RoastResult';
import type { RoastResult } from '../lib/types';

const mockResult: RoastResult = {
  roast: 'This prompt is a crime against clarity.',
  charges: ['✗ Vagueness: No context whatsoever.', '✗ Ambiguity: Goal is unclear.'],
  fixed: 'Write a detailed recipe for chocolate chip cookies including prep time.',
};

describe('RoastResult', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    });
  });

  it('renders roast, charges, and fixed sections when result is present', () => {
    render(<RoastResultView streamedText="" result={mockResult} />);
    expect(screen.getByText(/crime against clarity/i)).toBeInTheDocument();
    expect(screen.getByText(/Vagueness/i)).toBeInTheDocument();
    expect(screen.getByText(/chocolate chip cookies/i)).toBeInTheDocument();
  });

  it('copies fixed prompt to clipboard when copy button is clicked', async () => {
    render(<RoastResultView streamedText="" result={mockResult} />);
    await userEvent.click(screen.getByRole('button', { name: /copy fixed prompt/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockResult.fixed);
  });

  it('renders streamed text when result is not yet parsed', () => {
    render(<RoastResultView streamedText="[ROAST]\nLoading..." result={null} />);
    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument();
  });
});
