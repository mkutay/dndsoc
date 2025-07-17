import { redirect } from "next/navigation";
import { type Metadata } from "next";

import { ResetPasswordForm } from "./form";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password to access your account.",
  openGraph: {
    title: "Reset Password",
    description: "Reset your password to access your account.",
  },
};

export default async function ResetPassword() {
  const user = await getUser();
  if (user.isErr() || !user.value) redirect("/sign-in");

  return (
    <div className="flex flex-col max-w-prose">
      <TypographyH1>Reset Password</TypographyH1>
      <TypographyParagraph>Please enter your new password below.</TypographyParagraph>
      <div className="flex flex-col gap-2 mt-4">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
