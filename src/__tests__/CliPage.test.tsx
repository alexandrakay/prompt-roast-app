import { render, screen } from '@testing-library/react';
import CliPage from '../app/cli/page';

describe('CliPage', () => {
  it('shows the npm install command', () => {
    render(<CliPage />);
    expect(screen.getByText(/npm install -g prompt-roast/i)).toBeInTheDocument();
  });

  it('shows the roast usage command', () => {
    render(<CliPage />);
    expect(screen.getByText(/\$ roast/)).toBeInTheDocument();
  });

  it('links to the npm package page', () => {
    render(<CliPage />);
    const link = screen.getByRole('link', { name: /npm/i });
    expect(link).toHaveAttribute('href', 'https://www.npmjs.com/package/prompt-roast');
  });
});
