import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shivam | Video Editor + AI-Assisted Creative Workflow Specialist',
  description:
    'Premium portfolio for Shivam, a video editor helping creators and brands make engaging, scroll-stopping videos with editing, motion graphics, storytelling, and AI-assisted workflows.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="video"
          href="/videos/dev-faststart.mp4?v=2"
          type="video/mp4"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
