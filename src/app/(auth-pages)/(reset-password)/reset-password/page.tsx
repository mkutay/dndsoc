import { type Metadata } from "next";

import { ResetPasswordForm } from "./form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password to access your account.",
  openGraph: {
    title: "Reset Password",
    description: "Reset your password to access your account.",
  },
};

export default function ResetPassword() {
  return (
    <Card>
      <CardHeader className="md:p-6 p-3">
        <h1>
          <CardTitle className="md:text-left text-center md:pt-0 pt-1">Reset Password</CardTitle>
        </h1>
        <CardDescription>Please enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent className="md:p-6 md:pt-0 p-3 pt-0">
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
