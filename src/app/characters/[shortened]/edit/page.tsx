import { redirect } from "next/navigation";

import { TypographyH1 } from "@/components/typography/headings";
import { getUser } from "@/lib/users/user";
import { ErrorPage } from "@/components/error-page";
import { getCharacterByUser } from "@/lib/characters/query-user";
import { CharacterEditForm } from "./form";

export default async function Page(props: 
  { params: Promise<{ shortened: string }> }
) {
  const { shortened } = await props.params;

  const userResult = await getUser();
  if (userResult.isErr()) {
    redirect("/sign-in");
  }
  const user = userResult.value;

  const characterResult = await getCharacterByUser(user.id);
  if (characterResult.isErr()) {
    return <ErrorPage error={characterResult.error.message + characterResult.error.code} />;
  }
  const character = characterResult.value;
  if (character.length === 0) {
    return <ErrorPage error="You have no characters." />;
  }

  const characterToEdit = character.find((char) => char.shortened === shortened);
  if (!characterToEdit) {
    return redirect(`/characters/${shortened}`);
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose my-6 px-4 gap-6">
      <TypographyH1>Edit <span className="text-primary">{characterToEdit.name}</span>&apos;s Page</TypographyH1>
      <CharacterEditForm character={characterToEdit} />
    </div>
  );
}