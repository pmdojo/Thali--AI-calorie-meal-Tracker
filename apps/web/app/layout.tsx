import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';

const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Meet Thali AI — the nutrition coach that speaks your food',
  description:
    'Snap your thali, Thali reads the whole plate — dal, sabzi, roti, rice — and tells you the one small thing to do next. Calibrated for home food. Knows dal. Understands home food. Learns your habits.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable}>
      <body>{children}</body>
    </html>
  );
}
