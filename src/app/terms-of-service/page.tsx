import type { Metadata } from "next";

import { TypographyH1, TypographyH2, TypographyH3 } from "@/components/typography/headings";
import { TypographyParagraph, TypographySmall } from "@/components/typography/paragraph";
import { TypographyList } from "@/components/typography/list";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for the KCL D&D Society app, outlining user responsibilities and rights.",
  openGraph: {
    title: "Terms of Service",
    description: "Terms of service for the KCL D&D Society app, outlining user responsibilities and rights.",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="max-w-2xl">
        <TypographyH1>Terms of Service</TypographyH1>
        <TypographyParagraph>
          &ldquo;We&rdquo;, &ldquo;Us&rdquo;, &ldquo;Our&rdquo; are in reference to KCL DnD Society. &ldquo;You&rdquo;,
          &ldquo;Your&rdquo; are in reference to the user. &ldquo;Agreement&rdquo; is in reference to these terms of
          service.
        </TypographyParagraph>
        <TypographyParagraph className="mb-3">
          By accessing Our services You accept and agree to the following terms and conditions:
        </TypographyParagraph>
        <TypographySmall>
          We give no warranty as to the accuracy of the information or guidance for any specific purpose. The
          information and guidance contained on the website does not constitute legal or professional advice.
        </TypographySmall>
        <TypographyParagraph>
          All implied warranties and conditions are excluded, to the maximum extent permitted by law. We are in no way
          responsible or liable for any damage or loss whatsoever arising from viewing or downloading information from
          Our services and from the use of, or reliance on, the information and guidance on Our Services, although this
          does not affect claims in respect of death or personal injury caused by negligence. Any links to third parties
          websites are provided for convenience only. We have no control over such websites and accepts no liability for
          their content. We reserve the right at all times to vary, change, alter, amend or remove any of these terms.
          By using our services you accept that you are bound by the current terms and conditions and notices, and we
          therefore recommend that you check these each time you revisit the site. You must not use our services, and/or
          any interactive facilities which are available through it to:
        </TypographyParagraph>
        <TypographyList>
          <li>Commit or encourage unlawful acts or in breach of these terms of use;</li>
          <li>Misrepresent your identity;</li>
          <li>Hack, or attempt to hack, any part of the Our Services or any system used to run them;</li>
          <li>Post material that is obscene, offensive, or otherwise unlawful;</li>
          <li>
            Technically harm the website and/or its systems (including, without limitation, computer viruses or
            malicious software or harmful data).
          </li>
        </TypographyList>
        <TypographyParagraph>
          While We try to make this website available 24 hours a day, We reserve the right to suspend or withdraw
          access, without notice, to either the whole or part of Our Services, for any reason.
        </TypographyParagraph>
        <TypographyParagraph>We reserve the right to ban Your account for any reason.</TypographyParagraph>

        <TypographyH2 className="mt-8">Disclaimer</TypographyH2>

        <TypographyH3 className="mt-6">No liability to third parties</TypographyH3>
        <TypographyParagraph>
          Our dealings and contracts with Our users do not create a contract or other legally binding relationship
          between Us and anyone else, for example parents, guardians or friends.
        </TypographyParagraph>

        <TypographyH3 className="mt-6">Complaints</TypographyH3>
        <TypographyParagraph>
          Any complaint made about any material available from Our Services or information relating to the Us contained
          on external Internet sites will be addressed as soon as possible. These terms of service represent the entire
          agreement between the parties in regard to the use of Our Services. We in Our sole discretion are entitled to
          alter or amend Our Services and the terms of service without notice. Information contained on Our Services may
          be subject to conditions and/or disclaimers as indicated. English law governs these terms and your use of this
          website and you submit to the non-exclusive jurisdiction of the English courts.
        </TypographyParagraph>

        <TypographyH3 className="mt-6">Failure to Exercise Rights</TypographyH3>
        <TypographyParagraph>
          The failure of either party to exercise any rights under these terms and conditions shall not be deemed to be
          a waiver of that right.
        </TypographyParagraph>

        <TypographyH3 className="mt-6">If Any Provisions are Invalid</TypographyH3>
        <TypographyParagraph>
          If a court holds any provision of this Agreement to be illegal, invalid, or unenforceable, the remaining
          provisions will remain in full force and effect and the parties will amend the Agreement to give effect to the
          stricken clause to the maximum extent possible.
        </TypographyParagraph>
      </div>
    </div>
  );
}
