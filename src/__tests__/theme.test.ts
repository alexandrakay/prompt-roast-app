import { theme } from '../lib/theme';

describe('theme', () => {
  it('uses a hot ember primary with an acidic secondary accent', () => {
    expect(theme.palette.primary.main.toLowerCase()).toBe('#ff3d1f');
    expect(theme.palette.secondary.main.toLowerCase()).toBe('#f4ff52');
  });

  it('maintains dark mode with near-black background', () => {
    expect(theme.palette.mode).toBe('dark');
    expect(theme.palette.background.default).toBe('#080607');
  });

  it('uses CSS variable for body font so display font can override', () => {
    expect(theme.typography.fontFamily).toContain('var(--font-inter)');
  });
});
