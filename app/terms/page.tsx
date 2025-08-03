import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Terms of Service - ZE News',
  description: 'ZE News Terms of Service - Understand the terms and conditions for using our website and services.',
  keywords: 'terms of service, user agreement, ZE News, terms and conditions',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Terms of Service</CardTitle>
          <p className="text-muted-foreground">Last updated: January 2025</p>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using the ZE News website, you agree to comply with and be bound by the following terms and conditions.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use of Content</h2>
            <p>All content provided on this website is for informational purposes only. You may not reproduce, distribute, or exploit the content for commercial purposes without written permission from ZE News.</p>
            <p>You may share articles through social media or link to our content, but full reproduction requires permission.</p>
            <h3 className="text-xl font-medium mb-2 mt-4">Fair Use</h3>
            <ul>
              <li>Brief excerpts may be quoted for commentary or news reporting</li>
              <li>Proper attribution to ZE News must be provided</li>
              <li>Commercial use requires explicit written consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Conduct</h2>
            <p>When using our services, you agree not to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Post false, misleading, or defamatory content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to interfere with the website's functionality</li>
              <li>Use automated systems to access content without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account information, including your password, and for all activities that occur under your account.</p>
            <p>You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Disclaimer of Warranties</h2>
            <p>ZE News provides content "as is" without warranties of any kind. While we strive for accuracy, we do not guarantee that all information is complete, accurate, or up-to-date.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p>ZE News shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p>We reserve the right to terminate or suspend access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p>We may update our Terms of Service from time to time. We will notify you of any changes by posting the new Terms of Service on this page and updating the "Last updated" date.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which ZE News operates, without regard to its conflict of law provisions.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <ul>
              <li>Email: terms@zenews.com</li>
              <li>Address: ZE News Legal Team</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
