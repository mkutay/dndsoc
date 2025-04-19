import { redirect } from "next/navigation";

import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { getUser } from "@/lib/auth/user";
import { ResetPasswordForm } from "./form";

export default async function ResetPassword() {
  const user = await getUser();
  if (user.isErr() || !user.value) redirect("/sign-in");

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
