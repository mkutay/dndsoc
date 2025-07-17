import { EB_Garamond } from "next/font/google";
import Link from "next/link";

import { TypographyH1, TypographyH2, TypographyH3 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";

const garamond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
});

export default async function Page() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className={garamond.className}>
        <TypographyH1 className={garamond.className}>KCL D&D General Privacy Statement</TypographyH1>
        <TypographyParagraph> </TypographyParagraph>

        <TypographyH2 className={garamond.className}>KCL D&D Privacy Statement</TypographyH2>
        <TypographyParagraph>
          Here is where we tell you how we handle your &ldquo;Personal Data&rdquo;, which is information that can be
          directly or indirectly linked to you. It applies to the Personal Data that KCL D&D (&ldquo;Data
          Controller&rdquo; or &ldquo;We&rdquo;) processes when you interact with our &ldquo;Services&rdquo;.
        </TypographyParagraph>
        <TypographyParagraph> </TypographyParagraph>

        <TypographyH2 className={garamond.className}>Personal Data We Collect</TypographyH2>

        <TypographyH3 className={garamond.className}>From You</TypographyH3>
        <ul>
          <li>
            Account Data: We collect information when you open an account like your Name, Username, Email, KNumber, and
            password.
          </li>
          <li>
            User Content and Files: When you use our Services, We collect Personal Data included as part of the
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
        </ul>
        <TypographyParagraph> </TypographyParagraph>

        <TypographyH3 className={garamond.className}>Automatically</TypographyH3>
        <ul>
          <li>
            Essential Cookies and Similar Tracking Technologies: We reserve the right to use cookies and similar
            technologies to provide essential functionality.
          </li>
        </ul>
        <TypographyParagraph> </TypographyParagraph>

        <TypographyH2 className={garamond.className}>
          Lawful Bases for Processing Personal Data (Applicable to EEA and UK End Users)
        </TypographyH2>
        <TypographyParagraph>
          We processes Personal Data in compliance with the GDPR, ensuring a lawful basis for each processing activity.
        </TypographyParagraph>
        <TypographyParagraph> </TypographyParagraph>

        <TypographyH1 className={garamond.className}>Your Privacy Rights</TypographyH1>
        <TypographyParagraph>
          Depending on your residence location, you may have specific legal rights regarding your Personal Data:
        </TypographyParagraph>
        <ul>
          <li>The right to access the data collected about you</li>
          <li>
            The right to request detailed information about the specific types of Personal Data we&apos;ve collected
            over the past 12 months, including data disclosed for business purposes
          </li>
          <li>The right to rectify or update inaccurate or incomplete Personal Data under certain circumstances</li>
          <li>The right to erase or limit the processing of your Personal Data under specific conditions</li>
          <li>The right to object to the processing of your Personal Data, as allowed by applicable law</li>
          <li>The right to withdraw consent, where processing is based on your consent</li>
          <li>
            The right to receive your collected Personal Data in a structured, commonly used, and machine-readable
            format to facilitate its transfer to another company, where technically feasible
          </li>
        </ul>
        <TypographyParagraph>
          To exercise these rights, please send a message to us at{" "}
          <Link href="mailto:dndsockcl@gmail.com">dndsockcl@gmail.com</Link> and follow the instructions provided. To
          verify your identity for security, we may request extra information before addressing your data-related
          request.
        </TypographyParagraph>
        <TypographyParagraph> </TypographyParagraph>

        <TypographyH1 className={garamond.className}>TLDR:</TypographyH1>
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
