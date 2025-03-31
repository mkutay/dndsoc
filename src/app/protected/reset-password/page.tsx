import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { ResetPasswordForm } from "./form";

export default function ResetPassword() {
  return (
    <div className="flex flex-col w-full mx-auto max-w-prose my-12">
      <TypographyH1>Reset Password</TypographyH1>
      <TypographyParagraph>
        Please enter your new password below.
      </TypographyParagraph>
      <div className="flex flex-col gap-2 mt-8">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
