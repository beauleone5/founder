import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BoardSignal - News signals for your portfolio companies',
  description: 'Track news and impact signals for your private investments and board seats',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
