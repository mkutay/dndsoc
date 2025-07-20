"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { resendSignUpEmailConfirmationAction } from "@/server/auth/sign-up";
import { actionResultToResult } from "@/types/error-typing";

export function ResendButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  return (
    <Button
      className="w-full"
      variant="outline"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const result = actionResultToResult(await resendSignUpEmailConfirmationAction(email));
        setLoading(false);
        result.match(
          () =>
            toast({
              title: "Confirmation Email Resent",
              description: "Please check your email for the new confirmation link.",
            }),
          (error) =>
            toast({
              title: "Resend Confirmation Email Failed",
              description: "Please try again. " + error.message,
              variant: "destructive",
            }),
        );
      }}
    >
      Resend
    </Button>
  );
}
