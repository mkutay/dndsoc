import { AssociatesRequestsTable } from "@/components/associates-requests-table";
import { ErrorPage } from "@/components/error-page";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { runQuery } from "@/utils/supabase-run";

export default async function Page() {
  const requests = await getAllAssociatesRequests();
  if (requests.isErr()) {
    return <ErrorPage error={requests.error} />;
  }

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="space-y-8">
        <div>
          <TypographyH1>Associates Requests</TypographyH1>
          <TypographyParagraph className="text-muted-foreground">
            Manage membership requests for the D&D Society
          </TypographyParagraph>
        </div>
        <AssociatesRequestsTable requests={requests.value} />
      </div>
    </div>
  );
}

const getAllAssociatesRequests = () =>
  runQuery((supabase) =>
    supabase
      .from("associates_requests")
      .select("*, admins(*, users(*)), user:users!associates_requests_user_id_fkey(*)")
      .order("status", { ascending: false })
      .order("created_at", { ascending: false }),
  );
