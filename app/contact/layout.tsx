import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - ZE News | Get in Touch',
  description: 'Contact ZE News - reach out with news tips, feedback, or inquiries. Find our contact information, business hours, and send us a message directly.',
  keywords: 'contact ZE News, news tips, feedback, contact information, get in touch, ZE News contact form',
  openGraph: {
    title: 'Contact Us - ZE News | Get in Touch',
    description: 'Contact ZE News - reach out with news tips, feedback, or inquiries. Find our contact information and send us a message.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
