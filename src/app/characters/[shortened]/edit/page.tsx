import { TypographyH1 } from "@/components/typography/headings";
import { TypographyLink } from "@/components/typography/paragraph";
import { ErrorPage } from "@/components/error-page";
import { CharacterEditForm } from "./form";
import DB from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Page({ params }: 
  { params: Promise<{ shortened: string }> }
) {
  const { shortened } = await params;
  const result = await DB.Characters.Get.With.Player.Shortened({ shortened });

  if (result.isErr()) return <ErrorPage error={result.error} caller="/characters/[shortened]/page.tsx" isNotFound />;
  const character = result.value;

  const combinedAuth = await DB.Auth.Get.With.PlayerAndRole();
  if (combinedAuth.isErr() && combinedAuth.error.code !== "NOT_LOGGED_IN") return <ErrorPage error={combinedAuth.error} caller="/players/[username]" isForbidden />;

  const auth = combinedAuth.isOk() ? combinedAuth.value : null;
  const role = auth ? auth.roles?.role : null;
  const ownsCharacter = (character.player_uuid === auth?.players.id) || role === "admin";

  if (!ownsCharacter) {
    return <ErrorPage error={{ code: "FORBIDDEN", message: "You do not have permission to edit this character." }} caller="/characters/[shortened]/edit/page.tsx" isForbidden />;
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <TypographyLink href={`/characters/${shortened}`} className="tracking-wide font-quotes">
        Go Back
      </TypographyLink>
      <TypographyH1 className="mt-0.5">Edit <span className="text-primary">{character.name}</span>&apos;s Page</TypographyH1>
      <CharacterEditForm character={character} />
    </div>
  );
}

export async function generateStaticParams() {
  const characters = await DB.Characters.Get.All();
  if (characters.isErr()) return [];
  return characters.value.map((character) => ({
    shortened: character.shortened,
  }));
}