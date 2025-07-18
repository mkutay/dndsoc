import Link from "next/link";

import { CreatePollForm } from "@/components/when2dnd/create-poll-form";
import { ErrorPage } from "@/components/error-page";
import { getUserRole } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/typography/headings";
import { EnterCodeForm } from "@/components/when2dnd/enter-code-form";
import { TypographyParagraph } from "@/components/typography/paragraph";

export default async function Page() {
  const user = await getUserRole();
  if (user.isErr()) {
    return user.error.code === "NOT_LOGGED_IN" ? <NotSignedIn /> : <ErrorPage error={user.error} />;
  }

  const isDM = user.value.role === "dm" || user.value.role === "admin";

  if (isDM) {
    return (
      <div className="lg:max-w-6xl max-w-prose mx-auto px-4 my-12">
        <TypographyH1>Welcome to When2DnD</TypographyH1>
        <p className="text-xl font-quotes text-muted-foreground mt-2">
          The easiest way to schedule your Dungeons & Dragons sessions.
        </p>
        <CreatePollForm authUserUuid={user.value.auth_user_uuid} />
      </div>
    );
  }

  return (
    <div className="lg:max-w-6xl max-w-prose mx-auto px-4 my-12">
      <div className="max-w-prose">
        <TypographyH1>Welcome to When2DnD</TypographyH1>
        <p className="text-xl font-quotes text-muted-foreground mt-2">
          The easiest way to schedule your Dungeons & Dragons sessions.
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <TypographyParagraph>If you have a code from your DM, you can enter it as such:</TypographyParagraph>
          <EnterCodeForm />
        </div>
        <TypographyParagraph>If not, ask for a code from your DM.</TypographyParagraph>
      </div>
    </div>
  );
}

function NotSignedIn() {
  return (
    <div className="lg:max-w-6xl max-w-prose mx-auto px-4 my-12">
      <div className="max-w-prose">
        <TypographyH1>Welcome to When2DnD</TypographyH1>
        <p className="text-xl font-quotes text-muted-foreground mt-2">
          The easiest way to schedule your Dungeons & Dragons sessions.
        </p>
        <p className="mt-6">
          When2DnD helps you find the perfect time to play. As a Dungeon Master, you can create a poll with a range of
          dates and times. Share the link with your players, and they can mark their availability. It&apos;s that
          simple!
        </p>
        <p className="mt-4">
          And, as a player, you can easily vote on the best times that work for you. No more endless back-and-forth
          messages or trying to coordinate schedules.
        </p>
        <Button asChild className="mt-6">
          <Link href="/sign-in?redirect=/when2dnd">Sign In to Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
