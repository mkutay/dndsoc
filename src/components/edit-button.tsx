import { TiPencil } from "react-icons/ti";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function EditButton({ href }: { href: string }) {
  return (
    <Button asChild variant="outline" size="default" className="w-fit">
      <Link href={href}>
        <TiPencil size={24} className="mr-2" /> Edit
      </Link>
    </Button>
  );
}