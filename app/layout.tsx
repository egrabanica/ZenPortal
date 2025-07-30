import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'NewsPortal - Trusted News & Fact Checking',
    template: '%s | NewsPortal'
  },
  description: 'Get real-time news updates with integrated fact-checking and community verification.',
  keywords: ['news', 'fact-checking', 'journalism', 'real-time news', 'verified news'],
  authors: [{ name: 'NewsPortal Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://newsportal.com',
    siteName: 'NewsPortal',
    title: 'NewsPortal - Trusted News & Fact Checking',
    description: 'Get real-time news updates with integrated fact-checking and community verification.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NewsPortal - Trusted News & Fact Checking',
    description: 'Get real-time news updates with integrated fact-checking and community verification.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}