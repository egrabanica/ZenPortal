import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Cookie Policy - ZE News',
  description: 'ZE News Cookie Policy - Learn how we use cookies and similar technologies on our website.',
  keywords: 'cookie policy, cookies, tracking, ZE News, web technologies',
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Cookie Policy</CardTitle>
          <p className="text-muted-foreground">Last updated: January 2025</p>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p>ZE News uses cookies to:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve user experience and website functionality</li>
              <li>Provide personalized content and advertisements</li>
              <li>Ensure website security and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-medium mb-2 mt-4">Essential Cookies</h3>
            <p>These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">Performance Cookies</h3>
            <p>These cookies collect information about how visitors use our website, such as which pages are most popular. This data helps us improve our website's performance.</p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">Functionality Cookies</h3>
            <p>These cookies remember choices you make to improve your experience, like your preferred language or region.</p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">Targeting/Advertising Cookies</h3>
            <p>These cookies are used to deliver advertisements more relevant to you and your interests. They may be set by our advertising partners.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
            <p>We may allow third-party service providers to place cookies on your device for:</p>
            <ul>
              <li>Google Analytics - to analyze website usage</li>
              <li>Social media platforms - for sharing functionality</li>
              <li>Advertising networks - to serve relevant ads</li>
              <li>Content delivery networks - to improve loading times</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
            <p>You can control and manage cookies in several ways:</p>
            
            <h3 className="text-xl font-medium mb-2 mt-4">Browser Settings</h3>
            <p>Most browsers allow you to:</p>
            <ul>
              <li>View cookies stored on your device</li>
              <li>Delete existing cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Block all cookies</li>
              <li>Set cookies to be deleted when you close your browser</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 mt-4">Opt-Out Tools</h3>
            <p>You can opt out of advertising cookies through:</p>
            <ul>
              <li>Google Ads Settings</li>
              <li>Facebook Ad Preferences</li>
              <li>Digital Advertising Alliance opt-out page</li>
              <li>Network Advertising Initiative opt-out page</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookie Retention</h2>
            <p>Cookies are retained for different periods depending on their purpose:</p>
            <ul>
              <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent cookies:</strong> Remain for a set period (up to 2 years)</li>
              <li><strong>Analytics cookies:</strong> Typically retained for 2 years</li>
              <li><strong>Advertising cookies:</strong> Usually retained for 30 days to 1 year</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Impact of Disabling Cookies</h2>
            <p>If you disable cookies, some features of our website may not function properly:</p>
            <ul>
              <li>You may need to re-enter information repeatedly</li>
              <li>Some personalization features may not work</li>
              <li>We cannot remember your preferences</li>
              <li>Website analytics may be affected</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Updates to Cookie Policy</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p>If you have any questions about our use of cookies, please contact us at:</p>
            <ul>
              <li>Email: cookies@zenews.com</li>
              <li>Address: ZE News Cookie Policy Team</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
