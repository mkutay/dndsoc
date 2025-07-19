import { GiBowArrow } from "react-icons/gi";
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
      <div className="flex items-center gap-2">
        <GiBowArrow size={36} />
        <h3 className="scroll-m-20 sm:text-3xl text-2xl font-semibold tracking-tight font-headings">
          Pending Associates Requests
        </h3>
      </div>
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
      .select(
        "*, decision_by_user:users!associates_requests_decision_by_fkey(*), user:users!associates_requests_user_id_fkey(*)",
      )
      .order("created_at", { ascending: false })
      .eq("status", "pending"),
  );
