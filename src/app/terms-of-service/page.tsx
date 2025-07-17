import { TypographyH1 } from "@/components/typography/headings";
import { TypographyH2 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { EB_Garamond } from "next/font/google";

const garamond = EB_Garamond(
  {
    subsets: ["latin"],
    display: 'swap'
  }
)

export default async function Page() {
  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className={garamond.className}>
        
        <TypographyH1 className={garamond.className}>Terms of Service</TypographyH1>
        <TypographyParagraph>"We", "Us", "Our" are in reference to KCL DND. "You", "Your" are in reference to the user.</TypographyParagraph>
        <TypographyParagraph>By accessing Our services You accept and agree to the following terms and conditions: We give no warranty as to the accuracy of the information or guidance for any specific purpose. The information and guidance contained on the website does not constitute legal or professional advice.</TypographyParagraph>
        <TypographyParagraph>All implied warranties and conditions are excluded, to the maximum extent permitted by law. We are in no way responsible or liable for any damage or loss whatsoever arising from viewing or downloading information from Our services and from the use of, or reliance on, the information and guidance on Our Services, although this does not affect claims in respect of death or personal injury caused by negligence. Any links to third parties websites are provided for convenience only. We have no control over such websites and accepts no liability for their content. We reserve the right at all times to vary, change, alter, amend or remove any of these terms. By using our services you accept that you are bound by the current terms and conditions and notices, and we therefore recommend that you check these each time you revisit the site. You must not use our services, and/or any interactive facilities which are available through it to:</TypographyParagraph>
        <ul>
          <li>commit or encourage unlawful acts or in breach of these terms of use;</li>
          <li>misrepresent your identity;</li>
          <li>hack, or attempt to hack, any part of the Our Services or any system used to run them;</li>
          <li>post material that is obscene, offensive, or otherwise unlawful;</li>
          <li>technically harm the website and/or its systems (including, without limitation, computer viruses or malicious software or harmful data).</li>
        </ul> 
        <TypographyParagraph>While We try to make this website available 24 hours a day, We reserve the right to suspend or withdraw access, without notice, to either the whole or part of Our Services, for any reason.</TypographyParagraph>
        <TypographyParagraph>We reserve the right to ban Your account for any reason.</TypographyParagraph>
        <TypographyParagraph> </TypographyParagraph>
        
        <TypographyH1 className={garamond.className}>Disclaimer</TypographyH1>
        <TypographyParagraph> </TypographyParagraph>
        
        <TypographyH2 className={garamond.className}>No liability to third parties</TypographyH2>
        <TypographyParagraph>Our dealings and contracts with Our users do not create a contract or other legally binding relationship between Us and anyone else, for example parents, guardians or friends.</TypographyParagraph>
        <TypographyParagraph> </TypographyParagraph>
        
        <TypographyH2 className={garamond.className}>Complaints</TypographyH2>
        <TypographyParagraph>Any complaint made about any material available from Our Services or information relating to the Us contained on external Internet sites will be addressed as soon as possible. These terms of service represent the entire agreement between the parties in regard to the use of Our Services. We in Our sole discretion are entitled to alter or amend Our Services and the terms of service without notice. Information contained on Our Services may be subject to conditions and/or disclaimers as indicated. English law governs these terms and your use of this website and you submit to the non-exclusive jurisdiction of the English courts.</TypographyParagraph>
        <TypographyParagraph> </TypographyParagraph>
        
        <TypographyH2 className={garamond.className}>Failure to Exercise Rights</TypographyH2>
        <TypographyParagraph>The failure of either party to exercise any rights under these terms and conditions shall not be deemed to be a waiver of that right.</TypographyParagraph>
        <TypographyParagraph> </TypographyParagraph>
        
        <TypographyH2 className={garamond.className}>If Any Provisions are Invalid</TypographyH2>
        <TypographyParagraph>If a court holds any provision of this Agreement to be illegal, invalid, or unenforceable, the remaining provisions will remain in full force and effect and the parties will amend the Agreement to give effect to the stricken clause to the maximum extent possible.</TypographyParagraph>
        
      </div>
    </div>
  );
}

