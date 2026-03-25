import Link from 'next/link'
import globalConfig from '@/configs/global.config'
import PolicyHeader from '@/components/layouts/policy/header'

export const metadata = {
  title: `Privacy Policy — ${globalConfig.app.name}`,
  description: `Privacy Policy for ${globalConfig.app.name}`,
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <PolicyHeader />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: March 14, 2026
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-7">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p>
              Digital Village & Innovation Co., Ltd. (&quot;Company,&quot;
              &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates{' '}
              {globalConfig.app.name} (&quot;the Service&quot;). This Privacy
              Policy explains how we collect, use, disclose, and protect your
              personal information when you use our Service. Please read it
              carefully.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              2. Information We Collect
            </h2>
            <p>We collect the following categories of information:</p>

            <h3 className="text-base font-semibold mt-4 mb-2">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Account information:</strong> name, email address,
                password (stored as a hashed value).
              </li>
              <li>
                <strong>Profile information:</strong> display name, avatar, team
                details.
              </li>
              <li>
                <strong>Business data:</strong> content you create, upload, or
                process within the Service (e.g., documents, messages, CRM
                data).
              </li>
              <li>
                <strong>Communications:</strong> messages you send to our
                support team.
              </li>
            </ul>

            <h3 className="text-base font-semibold mt-4 mb-2">
              2.2 Information Collected Automatically
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Device identifiers:</strong> a browser fingerprint ID
                used for session management and security.
              </li>
              <li>
                <strong>Log data:</strong> IP address, browser type, pages
                visited, timestamps, and error logs.
              </li>
              <li>
                <strong>Cookies and session tokens:</strong> JWT-encoded session
                cookies used for authentication.
              </li>
            </ul>

            <h3 className="text-base font-semibold mt-4 mb-2">
              2.3 Information from Third-Party OAuth Providers
            </h3>
            <p>
              If you sign in via Google, GitHub, or Facebook, we receive your
              name, email address, and profile image from the respective
              provider, subject to their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              3. How We Use Your Information
            </h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, operate, and maintain the Service.</li>
              <li>
                Authenticate your identity and manage your account session.
              </li>
              <li>Process AI-assisted tasks and return results to you.</li>
              <li>
                Send transactional emails (e.g., OTP verification, password
                reset).
              </li>
              <li>Respond to support requests and resolve technical issues.</li>
              <li>
                Improve and develop new features through aggregated, anonymized
                analytics.
              </li>
              <li>
                Comply with legal obligations and enforce our Terms of Use.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. Legal Basis for Processing (PDPA)
            </h2>
            <p>
              For users in Thailand, we process your personal data under the
              Personal Data Protection Act B.E. 2562 (PDPA) on the following
              legal bases:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Contract:</strong> processing necessary to provide the
                Service you requested.
              </li>
              <li>
                <strong>Legitimate interest:</strong> security monitoring, fraud
                prevention, and service improvement.
              </li>
              <li>
                <strong>Legal obligation:</strong> compliance with applicable
                Thai law.
              </li>
              <li>
                <strong>Consent:</strong> where we explicitly request it (e.g.,
                marketing communications).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              5. Sharing Your Information
            </h2>
            <p>
              We do not sell your personal data. We may share it only in the
              following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Service providers:</strong> trusted third-party vendors
                (e.g., cloud hosting, email delivery via Mailtrap) who process
                data on our behalf under confidentiality agreements.
              </li>
              <li>
                <strong>OAuth providers:</strong> Google, GitHub, Facebook,
                solely to authenticate your sign-in.
              </li>
              <li>
                <strong>Legal requirements:</strong> if required by law, court
                order, or governmental authority.
              </li>
              <li>
                <strong>Business transfers:</strong> in connection with a
                merger, acquisition, or sale of assets, with notice to you.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active
              or as needed to provide the Service. You may request deletion of
              your account and associated data at any time by contacting us at{' '}
              <Link
                href="mailto:contact@dvith.com"
                className="text-primary underline"
              >
                contact@dvith.com
              </Link>
              . We may retain certain data for legal compliance purposes for up
              to 5 years.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your data, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>HTTPS encryption for all data in transit.</li>
              <li>
                JWT-signed session tokens with short expiry and refresh token
                rotation.
              </li>
              <li>Hashed password storage (never stored in plaintext).</li>
              <li>
                Device fingerprinting to detect anomalous session activity.
              </li>
            </ul>
            <p className="mt-2">
              No method of transmission over the internet is 100% secure. We
              cannot guarantee absolute security but will notify you of any
              breach as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              8. Cookies and Tracking
            </h2>
            <p>We use the following types of cookies:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Session cookies:</strong> a JWT-encoded{' '}
                <code className="rounded bg-muted px-1 py-0.5 font-mono">
                  session
                </code>{' '}
                cookie required for authentication.
              </li>
              <li>
                <strong>Locale cookies:</strong> stores your language preference
                (EN/TH).
              </li>
              <li>
                <strong>Device ID cookies:</strong> a persistent ID used for
                security and session binding.
              </li>
            </ul>
            <p className="mt-2">
              You can configure your browser to refuse cookies, but doing so may
              prevent you from using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Your Rights</h2>
            <p>
              Subject to applicable law (including the PDPA), you have the right
              to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate or incomplete data.</li>
              <li>
                Request deletion of your data (&quot;right to be
                forgotten&quot;).
              </li>
              <li>
                Withdraw consent for processing based on consent at any time.
              </li>
              <li>
                Lodge a complaint with the Personal Data Protection Committee
                (PDPC) of Thailand.
              </li>
            </ul>
            <p className="mt-2">
              To exercise these rights, email{' '}
              <Link
                href="mailto:contact@dvith.com"
                className="text-primary underline"
              >
                contact@dvith.com
              </Link>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              10. Children&apos;s Privacy
            </h2>
            <p>
              The Service is not directed to individuals under 18 years of age.
              We do not knowingly collect personal data from children. If you
              believe we have inadvertently collected such data, please contact
              us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              11. International Transfers
            </h2>
            <p>
              Your data may be processed outside of Thailand by our cloud
              service providers. When we transfer personal data internationally,
              we ensure adequate protections are in place in accordance with the
              PDPA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              12. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you
              of material changes by updating the &quot;Last updated&quot; date
              or by email. Your continued use of the Service after the effective
              date constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
            <p>
              For privacy-related inquiries or to exercise your rights, contact
              our Data Protection Officer:
            </p>
            <address className="mt-2 not-italic text-muted-foreground">
              Digital Village & Innovation Co., Ltd.
              <br />
              Email:{' '}
              <Link
                href="mailto:contact@dvith.com"
                className="text-primary underline"
              >
                contact@dvith.com
              </Link>
            </address>
          </section>
        </div>

        <div className="mt-12 flex gap-4 border-t pt-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground hover:underline">
            Terms of Use
          </Link>
          <Link href="/" className="hover:text-foreground hover:underline">
            Home
          </Link>
        </div>
      </main>
    </div>
  )
}
