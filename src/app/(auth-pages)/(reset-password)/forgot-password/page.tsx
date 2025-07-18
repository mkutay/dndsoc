import { type Metadata } from "next";

import { ForgotPasswordForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  );
}
