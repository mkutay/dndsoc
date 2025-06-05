import { TiPencil } from "react-icons/ti";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function DMEditButton({ username }: { username: string }) {
  return (
    <Button asChild variant="outline" size="default" className="w-fit">
      <Link href={`/dms/${username}/edit`}>
        <TiPencil size={24} className="mr-2" /> Edit
      </Link>
    </Button>
  );
}