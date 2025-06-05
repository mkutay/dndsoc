import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TiPencil } from "react-icons/ti";

export function PartyEditButton({ ownsAs, shortened }: { ownsAs: "dm" | "player" | "admin" | null, shortened: string }) {
  if (!ownsAs) return null;

  ownsAs = ownsAs === "admin" ? "dm" : ownsAs;

  return (
    <Button asChild variant="outline" size="default" className="w-fit">
      <Link href={`/parties/${shortened}/edit/${ownsAs}`}>
        <TiPencil size={24} className="mr-2" /> Edit
      </Link>
    </Button>
  );
}