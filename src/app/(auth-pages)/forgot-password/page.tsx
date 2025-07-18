import { type Metadata } from "next";

import { ForgotPasswordForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Dither from "@/components/reactbits/dithering";
import { Logo } from "@/components/logo";

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
    <div className="relative flex min-h-svh w-full items-center justify-center p-2 sm:p-4 md:p-10">
      <div className="absolute inset-0 z-0">
        <Dither enableMouseInteraction={false} />
      </div>
      <div className="absolute top-8 mx-auto z-10 shadow-md rounded-full">
        <Logo className="backdrop-blur-sm py-3 px-4 rounded-full" disableText />
      </div>
      <div className="relative z-10 w-full max-w-md shadow-2xl">
        <Card>
          <CardHeader>
            <h1>
              <CardTitle>Forgot Your Password</CardTitle>
            </h1>
            <CardDescription>Please enter your email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
