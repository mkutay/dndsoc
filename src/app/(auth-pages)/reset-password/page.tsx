import { redirect } from "next/navigation";

import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { getUser } from "@/lib/auth";
import { ResetPasswordForm } from "./form";

export const dynamic = "force-dynamic";

export default async function ResetPassword() {
  const user = await getUser();
  if (user.isErr() || !user.value) redirect("/sign-in");

  return (
    <div className="flex flex-col max-w-prose">
      <TypographyH1>Reset Password</TypographyH1>
      <TypographyParagraph>
        Please enter your new password below.
      </TypographyParagraph>
      <div className="flex flex-col gap-2 mt-4">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
