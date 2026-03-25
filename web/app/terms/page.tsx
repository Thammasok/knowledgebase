import Link from 'next/link'
import globalConfig from '@/configs/global.config'
import PolicyHeader from '@/components/layouts/policy/header'

export const metadata = {
  title: `Terms of Use — ${globalConfig.app.name}`,
  description: `Terms of Use for ${globalConfig.app.name}`,
}

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-background">
      <PolicyHeader />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Terms of Use</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: March 14, 2026
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-7">
          <section>
            <h2 className="text-xl font-semibold mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using {globalConfig.app.name} (&quot;the
              Service&quot;), provided by Digital Village & Innovation Co., Ltd.
              (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;), you agree to be bound by these Terms of Use
              (&quot;Terms&quot;). If you do not agree to these Terms, do not
              use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              2. Description of Service
            </h2>
            <p>
              {globalConfig.app.name} is an AI-powered assistant platform
              designed for business use. The Service includes tools for
              financial planning, CRM, team collaboration, and AI-assisted
              workflows. Features are subject to change at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Eligibility</h2>
            <p>
              You must be at least 18 years old and have the legal authority to
              enter into a binding agreement on behalf of yourself or your
              organization. By using the Service, you represent and warrant that
              you meet these requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              4. Account Registration
            </h2>
            <p>
              You may register using an email address and password or via
              supported OAuth providers (Google, GitHub, Facebook). You are
              responsible for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                Maintaining the confidentiality of your account credentials.
              </li>
              <li>All activities that occur under your account.</li>
              <li>
                Notifying us immediately at{' '}
                <Link
                  href="mailto:contact@dvith.com"
                  className="text-primary underline"
                >
                  contact@dvith.com
                </Link>{' '}
                of any unauthorized access.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Violate any applicable law or regulation.</li>
              <li>
                Transmit harmful, offensive, or unlawful content, including
                spam, malware, or phishing material.
              </li>
              <li>
                Attempt to gain unauthorized access to the Service, its servers,
                or any related systems.
              </li>
              <li>
                Reverse engineer, decompile, or disassemble any part of the
                Service.
              </li>
              <li>
                Use automated tools (bots, scrapers) to access the Service
                without prior written consent.
              </li>
              <li>
                Impersonate any person or entity or misrepresent your
                affiliation with any person or entity.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              6. Intellectual Property
            </h2>
            <p>
              All content, trademarks, logos, and software within the Service
              are the property of the Company or its licensors and are protected
              by applicable intellectual property laws. You are granted a
              limited, non-exclusive, non-transferable license to access and use
              the Service solely for your internal business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. User Content</h2>
            <p>
              You retain ownership of any data or content you submit to the
              Service (&quot;User Content&quot;). By submitting User Content,
              you grant the Company a worldwide, royalty-free license to use,
              store, and process it solely to provide and improve the Service.
              You represent that you have all necessary rights to grant this
              license.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              8. AI-Generated Content
            </h2>
            <p>
              The Service includes AI-assisted features. AI-generated outputs
              are provided for informational purposes only and do not constitute
              professional financial, legal, or business advice. You are solely
              responsible for any decisions made based on AI-generated content.
              We do not warrant the accuracy, completeness, or fitness for any
              particular purpose of AI outputs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the
              Service at our sole discretion, with or without notice, for
              conduct that we believe violates these Terms or is harmful to
              other users, the Company, or third parties. Upon termination, your
              right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              10. Disclaimer of Warranties
            </h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
              UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              11. Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
              INCURRED DIRECTLY OR INDIRECTLY, ARISING FROM YOUR USE OF THE
              SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of
              material changes by updating the &quot;Last updated&quot; date at
              the top of this page or by sending you an email. Your continued
              use of the Service after changes take effect constitutes your
              acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of Thailand, without regard to its conflict of law
              provisions. Any disputes shall be subject to the exclusive
              jurisdiction of the courts located in Bangkok, Thailand.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">14. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
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
          <Link
            href="/privacy"
            className="hover:text-foreground hover:underline"
          >
            Privacy Policy
          </Link>
          <Link href="/" className="hover:text-foreground hover:underline">
            Home
          </Link>
        </div>
      </main>
    </div>
  )
}
