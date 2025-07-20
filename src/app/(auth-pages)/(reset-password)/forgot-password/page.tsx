import { type Metadata } from "next";

import { ForgotPasswordForm } from "./form";
import { TypographyLink } from "@/components/typography/paragraph";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Forgot Your Password?",
  description: "Forgot your password? Enter your email to reset it.",
  openGraph: {
    title: "Forgot Your Password?",
    description: "Forgot your password? Enter your email to reset it.",
  },
};

export default function ForgotPassword() {
  return (
    <Card>
      <CardHeader className="md:p-6 p-3">
        <h1>
          <CardTitle className="md:text-left text-center md:pt-0 pt-1">Forgot Your Password</CardTitle>
        </h1>
      </CardHeader>
      <CardContent className="md:p-6 md:pt-0 p-3 pt-0">
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter className="md:p-6 md:pt-0 p-3 pt-0">
        <div className="w-full text-center text-sm font-quotes">
          Remembered your password? <TypographyLink href="/sign-in">Sign in</TypographyLink>
        </div>
      </CardFooter>
    </Card>
  );
}
