import { type Metadata } from "next";

import { SignUpForm } from "./form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyLink } from "@/components/typography/paragraph";

export const metadata: Metadata = {
  title: "Sign Up To Our Society!",
  description: "Join our Dungeons and Dragons society and start your journey with us today.",
  openGraph: {
    title: "Sign Up To Our Society!",
    description: "Join our Dungeons and Dragons society and start your journey with us today.",
  },
};

export default function SignUp() {
  return (
    <Card>
      <CardHeader className="md:p-6 p-3">
        <h1>
          <CardTitle className="md:text-left text-center md:pt-0 pt-1">Sign Up</CardTitle>
        </h1>
      </CardHeader>
      <CardContent className="md:p-6 md:pt-0 p-3 pt-0">
        <SignUpForm />
      </CardContent>
      <CardFooter className="md:p-6 md:pt-0 p-3 pt-0">
        <div className="w-full text-center text-sm font-quotes">
          Already have an account? <TypographyLink href="/sign-in">Sign in</TypographyLink>
        </div>
      </CardFooter>
    </Card>
  );
}
