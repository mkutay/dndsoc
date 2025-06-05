import Link from "next/link";

import { Button } from "./ui/button";
import { TiPencil } from "react-icons/ti";

export function CharacterEditButton({ shortened }: { shortened: string }) {
  return (
    <Button asChild variant="outline" size="default" className="w-fit">
      <Link href={`/characters/${shortened}/edit`}>
        <TiPencil size={24} className="mr-2" /> Edit
      </Link>
    </Button>
  );
}