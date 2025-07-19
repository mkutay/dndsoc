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
      <CardHeader>
        <h1>
          <CardTitle>Sign Up</CardTitle>
        </h1>
        {/* <CardDescription>Please enter your information to sign up.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="w-full text-center text-sm font-quotes">
          Already have an account? <TypographyLink href="/sign-in">Sign in</TypographyLink>
        </div>
        {/* <div className="w-full text-center text-sm font-quotes">
          Not a KCL student? <TypographyLink href="/associates-sign-up">Join as an associate</TypographyLink>
        </div> */}
      </CardFooter>
    </Card>
  );
}
