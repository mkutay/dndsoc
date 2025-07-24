import { cache } from "react";
import type { Metadata } from "next";
import postgres from "postgres";
import { fromPromise } from "neverthrow";
import { forbidden } from "next/navigation";

import { TypographyLink, TypographyParagraph, TypographySmall } from "@/components/typography/paragraph";
import { TypographyH1 } from "@/components/typography/headings";
import { ErrorPage } from "@/components/error-page";
import { truncateText } from "@/utils/formatting";
import { EditThingy } from "@/components/thingies/edit-thingy";
import { Badge } from "@/components/ui/badge";
import { TypographyHr } from "@/components/typography/blockquote";
import type { Tables } from "@/types/database.types";
import { getUserRole } from "@/lib/roles";
import { env } from "@/env";

export const dynamic = "force-dynamic";

/*
 * Very very bad code as the self-referencing query didn't work with supabase.
 * This should be a temporary solution, but we all know it will stay like this for a while.
 */

const sql = postgres(env.DATABASE_URL);

type QueryResult = Tables<"thingy"> & {
  next_thingy_shortened: string | null; // text, nullable
  next_thingy_name: string | null;
  user_uuid: string | null; // uuid, nullable
} & {
  characters: Tables<"characters">;
};

const getThingyByShortened = (shortened: string) =>
  fromPromise(
    sql<QueryResult[]>`
SELECT 
  t.*,
  nt.shortened as next_thingy_shortened,
  nt.name as next_thingy_name,
  row_to_json(c) AS characters,
  p.auth_user_uuid as user_uuid
FROM thingy t
LEFT JOIN thingy nt ON t.next = nt.id
LEFT JOIN characters c ON t.character_id = c.id
LEFT JOIN players p ON c.player_uuid = p.id
WHERE t.shortened = ${shortened}
ORDER BY t.created_at DESC
LIMIT 1;`,
    (error) => ({
      code: "GET_THINGY_BY_SHORTENED_ERROR" as const,
      message: "Failed to fetch thingy by shortened. " + error,
    }),
  );

const cachedGetThingyByShortened = cache(getThingyByShortened);

export async function generateMetadata({ params }: { params: Promise<{ shortened: string }> }): Promise<Metadata> {
  const { shortened } = await params;
  const result = await cachedGetThingyByShortened(shortened);
  if (result.isErr()) return { title: "Thingy Not Found" };
  const thingy = result.value[0];
  if (!thingy) return { title: "Thingy Not Found" };

  const description = truncateText(thingy.description, 160);

  return {
    title: thingy.name,
    description,
    openGraph: {
      title: thingy.name,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ shortened: string }> }) {
  const { shortened } = await params;
  const result = await cachedGetThingyByShortened(shortened);
  if (result.isErr()) return <ErrorPage error={result.error} />;
  const thingy = result.value[0];
  if (!thingy) return <ErrorPage error="Thingy not found" isNotFound />;

  const user = await getUserRole();
  const ownsThingy =
    user.isOk() &&
    (user.value.role === "admin" || user.value.role === "dm" || thingy.user_uuid === user.value.auth_user_uuid);

  if (thingy.public === false && !ownsThingy) {
    forbidden();
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      {thingy.next_thingy_shortened && thingy.next_thingy_name ? (
        <TypographyParagraph className="text-destructive mb-6 font-quotes rounded-md text-lg border-2 border-destructive/80 p-6 w-fit mx-auto">
          NOTE: This thingy is an older version of{" "}
          <TypographyLink variant="primary" href={`/thingies/${thingy.next_thingy_shortened}`}>
            {thingy.next_thingy_name}
          </TypographyLink>
          .
        </TypographyParagraph>
      ) : null}
      {thingy.characters ? (
        <TypographySmall>
          <TypographyLink href={`/characters/${thingy.characters.shortened}`}>
            Owned by {thingy.characters.name}
          </TypographyLink>
        </TypographySmall>
      ) : null}
      <div className="flex flex-row flex-wrap justify-between gap-6 items-center">
        <TypographyH1>{thingy.name}</TypographyH1>
        {thingy.character_id && !thingy.next_thingy_name && !thingy.next_thingy_shortened ? (
          <EditThingy thingy={thingy} characterUuid={thingy.character_id} />
        ) : null}
      </div>
      {thingy.tags.length !== 0 && (
        <div className="flex flex-wrap gap-1 max-w-lg mt-6">
          {thingy.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <TypographyHr className="my-12" />
      <TypographyParagraph className="max-w-prose not-first:mt-0">{thingy.description}</TypographyParagraph>
    </div>
  );
}
