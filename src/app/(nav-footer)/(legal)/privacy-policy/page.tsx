import type { Metadata } from "next";

import { TypographyH1, TypographyH2, TypographyH3 } from "@/components/typography/headings";
import { TypographyLink, TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyList } from "@/components/typography/list";

export const metadata: Metadata = {
  title: "KCL D&D Society App Privacy Policy",
  description: "Privacy policy for the KCL D&D Society app, detailing how we handle your personal data.",
  openGraph: {
    title: "KCL D&D Society App Privacy Policy",
    description: "Privacy policy for the KCL D&D Society app, detailing how we handle your personal data.",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="max-w-2xl">
        <TypographyH1>KCL DnD Society App Privacy Policy</TypographyH1>

        <TypographyH2 className="mt-8">KCL D&D Privacy Statement</TypographyH2>
        <TypographyParagraph>
          Here is where we tell you how we handle your &ldquo;Personal Data,&rdquo; which is information that can be
          directly or indirectly linked to you. It applies to the Personal Data that KCL D&D (&ldquo;Data
          Controller&rdquo; or &ldquo;We&rdquo;) processes when you interact with our &ldquo;Services.&rdquo;
        </TypographyParagraph>

        <TypographyH2 className="mt-8">Personal Data We Collect</TypographyH2>

        <TypographyH3 className="mt-6">From You</TypographyH3>
        <TypographyList>
          <li>
            Account Data: We collect information when you open an account like your name, username, email, K-number, and
            password.
          </li>
          <li>
            User Content and Files: When you use our Services, we collect Personal Data included as part of the
            information you provided like character sheet details, images, files, etc.
          </li>
          <li>Feedback Data: This consists of information you submit through surveys and reviews.</li>
          <li>
            Profile Information: We collect information to create a user profile, which may include a photo, email
            addresses, or biography.
          </li>
          <li>
            Support Data: When you seek customer support, we collect details like code, text, or multimedia files.
          </li>
        </TypographyList>

        <TypographyH3 className="mt-6">Automatically</TypographyH3>
        <TypographyList>
          <li>
            Essential Cookies and Similar Tracking Technologies: We reserve the right to use cookies and similar
            technologies to provide essential functionality.
          </li>
        </TypographyList>

        <TypographyH2 className="mt-8">Third Party Services</TypographyH2>

        <TypographyParagraph>
          There are two third party services we use to help us operate our Services:{" "}
          <TypographyLink href="https://hetzner.com">Hetzner</TypographyLink> (for hosting) and{" "}
          <TypographyLink href="https://cloudflare.com">Cloudflare</TypographyLink> (for DNS resolving, DOS protection,
          and domain services). These third parties may have access to your Personal Data only to perform specific tasks
          on our behalf and are obligated not to disclose or use it for any other purpose. Apart from them, we do not
          use any third-party services, as we host our Services ourselves.
        </TypographyParagraph>

        <TypographyH2 className="mt-8">
          Lawful Bases for Processing Personal Data (Applicable to EEA and UK End Users)
        </TypographyH2>
        <TypographyParagraph>
          We processes Personal Data in compliance with the GDPR, ensuring a lawful basis for each processing activity.
        </TypographyParagraph>

        <TypographyH2 className="mt-8">Your Privacy Rights</TypographyH2>
        <TypographyParagraph>
          Depending on your residence location, you may have specific legal rights regarding your Personal Data:
        </TypographyParagraph>
        <TypographyList>
          <li>The right to access the data collected about you.</li>
          <li>
            The right to request detailed information about the specific types of Personal Data we&apos;ve collected
            over the past 12 months, including data disclosed for business purposes.
          </li>
          <li>The right to rectify or update inaccurate or incomplete Personal Data under certain circumstances.</li>
          <li>The right to erase or limit the processing of your Personal Data under specific conditions.</li>
          <li>The right to object to the processing of your Personal Data, as allowed by applicable law.</li>
          <li>The right to withdraw consent, where processing is based on your consent.</li>
          <li>
            The right to receive your collected Personal Data in a structured, commonly used, and machine-readable
            format to facilitate its transfer to another company, where technically feasible.
          </li>
        </TypographyList>
        <TypographyParagraph>
          To exercise these rights, please send a message to us at{" "}
          <TypographyLink href="mailto:dndsockcl@gmail.com">dndsockcl@gmail.com</TypographyLink> and follow the
          instructions provided. To verify your identity for security, we may request extra information before
          addressing your data-related request.
        </TypographyParagraph>

        <TypographyH2 className="mt-8">TLDR</TypographyH2>
        <TypographyParagraph>
          We collect data which you provide us in order to be able to make our services functional. We made the hard
          decision and decided not to sell any of it to advertisers (or hordes of orc). We hold your data until you
          delete your account, or we delete your account (either due to long term inactivity, our services go down, or a
          dragon attacked our database). Anything we do is our best effort to maximize your privacy and to make our
          services work :)
        </TypographyParagraph>
      </div>
    </div>
  );
}
