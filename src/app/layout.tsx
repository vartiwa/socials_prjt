import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MeetHub — Meeting Collaboration & AI Task Automation | Linear Integration',
  description: 'Turn meeting speech, transcripts, and recordings into verified action tickets in Linear automatically. Real-time collaboration, notes, and task sync.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#000000] text-[#0F172A] font-sans antialiased min-h-screen selection:bg-[#06B6D4] selection:text-[#083344]">
        {children}
      </body>
    </html>
  );
}



