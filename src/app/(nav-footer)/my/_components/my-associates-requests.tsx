import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ErrorPage } from "@/components/error-page";
import { runQuery } from "@/utils/supabase-run";
import { AssociatesRequestsTable } from "@/components/associates-requests-table";

export async function MyAssociatesRequests() {
  const requests = await getPendingAssociatesRequests();
  if (requests.isErr()) {
    return <ErrorPage error={requests.error} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <AssociatesRequestsTable requests={requests.value} />
      <div className="flex justify-end">
        <Button variant="outline" asChild className="w-fit" size="lg">
          <Link href="/associates-requests">See All Requests</Link>
        </Button>
      </div>
    </div>
  );
}

const getPendingAssociatesRequests = () =>
  runQuery((supabase) =>
    supabase
      .from("associates_requests")
      .select("*, admins(*, users(*)), user:users!associates_requests_user_id_fkey(*)")
      .order("created_at", { ascending: false })
      .eq("status", "pending"),
  );
