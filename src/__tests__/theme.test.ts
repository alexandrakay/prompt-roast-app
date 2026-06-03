import { theme } from '../lib/theme';

describe('theme', () => {
  it('uses orange/amber as primary accent, not red', () => {
    const primary = theme.palette.primary.main.toLowerCase();
    expect(primary).not.toBe('#ff4444');
    expect(primary).toMatch(/^#(ff6|ff7|f97|ea|f6|fb)/);
  });

  it('maintains dark mode with near-black background', () => {
    expect(theme.palette.mode).toBe('dark');
    expect(theme.palette.background.default).toBe('#0a0a0a');
  });

  it('uses CSS variable for body font so display font can override', () => {
    expect(theme.typography.fontFamily).toContain('var(--font-inter)');
  });
});
