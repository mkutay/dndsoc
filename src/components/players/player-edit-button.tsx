import { TiPencil } from "react-icons/ti";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PlayerEditButton({ username }: { username: string }) {
  return (
    <Button asChild variant="outline" size="default" className="w-fit">
      <Link href={`/players/${username}/edit`}>
        <TiPencil size={24} className="mr-2" /> Edit
      </Link>
    </Button>
  );
}