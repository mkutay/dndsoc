import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TiPencil } from "react-icons/ti";

export function DMEditButton({ username }: { username: string }) {
  return (
    <Button asChild variant="outline" size="icon">
      <Link href={`/dms/${username}/edit`}>
        <TiPencil size={24} />
      </Link>
    </Button>
  );
}