import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TiPencil } from "react-icons/ti";

export function PartyEditButton({ ownsAs, shortened }: { ownsAs: "dm" | "player" | null, shortened: string }) {
  if (!ownsAs) return null;

  return (
    <Button asChild variant="outline" size="icon">
      <Link href={`/parties/${shortened}/edit/${ownsAs}`}>
        <TiPencil size={24} />
      </Link>
    </Button>
  );
}