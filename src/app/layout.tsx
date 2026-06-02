import type { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Prompt Roast',
  description: 'Get your prompts brutally critiqued and rewritten by AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NavBar />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
