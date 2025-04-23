import { TiPencil } from "react-icons/ti";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PlayerEditButton({ username }: { username: string }) {
  return (
    <Button asChild variant="outline" size="icon">
      <Link href={`/players/${username}/edit`}>
        <TiPencil size={24} />
      </Link>
    </Button>
  );
}