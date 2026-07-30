import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meet Thali AI — the nutrition coach that speaks your food',
  description:
    'Snap your thali, Thali reads the whole plate — dal, sabzi, roti, rice — and tells you the one small thing to do next. Calibrated for home food. Knows dal. Understands home food. Learns your habits.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
