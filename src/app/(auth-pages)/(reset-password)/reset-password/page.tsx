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
      <CardHeader>
        <h1>
          <CardTitle>Reset Password</CardTitle>
        </h1>
        <CardDescription>Please enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
