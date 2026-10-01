import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Vaani - Voice AI Career Coach',
  description: 'Speak your career question. Get an answer in seconds.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-zinc-950 text-zinc-50 antialiased selection:bg-amber-500/30 selection:text-amber-200`}>
        {children}
      </body>
    </html>
  );
}
