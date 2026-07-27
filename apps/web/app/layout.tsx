import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thali — AI nutrition coach for Indian meals',
  description:
    'Calorie tracking calibrated for mixed home-cooked Indian meals. Ranges, not fake precision. One better choice at a time, not a lecture.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
