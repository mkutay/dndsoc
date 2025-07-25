import { forbidden } from "next/navigation";

import { ErrorPage } from "@/components/error-page";
import { ManageAuctions } from "@/components/manage-auctions";
import { TypographyH1 } from "@/components/typography/headings";
import { TypographyParagraph } from "@/components/typography/paragraph";
import { getUserRole } from "@/lib/roles";
import { runQuery } from "@/utils/supabase-run";

export default async function Page() {
  const user = await getUserRole();
  if (user.isErr()) {
    return user.error.code === "NOT_LOGGED_IN" ? forbidden() : <ErrorPage error={user.error} />;
  }

  if (user.value.role !== "admin" && user.value.role !== "dm") {
    return forbidden();
  }

  const DM = await runQuery((supabase) =>
    supabase.from("dms").select("*").eq("auth_user_uuid", user.value.auth_user_uuid).single(),
  );

  if (DM.isErr()) {
    return <ErrorPage error={DM.error} />;
  }

  const result = await getAllAuctions();
  if (result.isErr()) return <ErrorPage error={result.error} />;

  const auctions = result.value.filter((auction) => {
    if (user.value.role === "admin") return true;
    if (user.value.role === "dm") {
      return auction.sold_thingy.dms.some((dm) => dm.dm_id === DM.value.id);
    }
    return false;
  });

  return (
    <div className="flex flex-col w-full mx-auto lg:max-w-6xl max-w-prose lg:my-12 mt-6 mb-12 px-4">
      <div className="space-y-8">
        <div>
          <TypographyH1>Auction Approval</TypographyH1>
          <TypographyParagraph className="text-muted-foreground">
            Manage auctions for the DnD Society.
          </TypographyParagraph>
        </div>
        <ManageAuctions auctions={auctions} />
      </div>
    </div>
  );
}

const getAllAuctions = () =>
  runQuery((supabase) =>
    supabase
      .from("auction")
      .select(
        `*,
        sold_thingy:thingy!auction_seller_thingy_id_fkey(
          *,
          characters(
            name, shortened, id,
            character_party(
              parties(
                dm_party(
                  dms(
                    id,
                    users(username, auth_user_uuid)
                  )
                )
              )
            )
          )
        ),
        counter_thingy:thingy!auction_buyer_thingy_id_fkey(
          *,
          characters(
            name, shortened, id,
            character_party(
              parties(
                dm_party(
                  dms(
                    id,
                    users(username, auth_user_uuid)
                  )
                )
              )
            )
          )
        ),
        dms(
          users(name, username)
        )
        `,
      )
      .is("next", null)
      .order("created_at", { ascending: false }),
  ).map((data) => {
    return data.map((auction) => ({
      id: auction.id,
      status: auction.status,
      created_at: auction.created_at,
      valid: auction.valid,
      next: auction.next,
      amount: auction.amount,
      sold_thingy: {
        created_at: auction.sold_thingy.created_at,
        description: auction.sold_thingy.description,
        id: auction.sold_thingy.id,
        name: auction.sold_thingy.name,
        next: auction.sold_thingy.next,
        public: auction.sold_thingy.public,
        shortened: auction.sold_thingy.shortened,
        tags: auction.sold_thingy.tags,
        character: auction.sold_thingy.characters
          ? {
              id: auction.sold_thingy.characters.id,
              name: auction.sold_thingy.characters.name,
              shortened: auction.sold_thingy.characters.shortened,
            }
          : null,
        dms:
          auction.sold_thingy.characters?.character_party.flatMap((party) =>
            party.parties.dm_party.map((dmParty) => ({
              dm_id: dmParty.dms.id,
              user_id: dmParty.dms.users.auth_user_uuid,
              username: dmParty.dms.users.username,
            })),
          ) ?? [],
      },
      counter_thingy: auction.counter_thingy
        ? {
            created_at: auction.counter_thingy.created_at,
            description: auction.counter_thingy.description,
            id: auction.counter_thingy.id,
            name: auction.counter_thingy.name,
            next: auction.counter_thingy.next,
            public: auction.counter_thingy.public,
            shortened: auction.counter_thingy.shortened,
            tags: auction.counter_thingy.tags,
            character: auction.counter_thingy.characters
              ? {
                  id: auction.counter_thingy.characters.id,
                  name: auction.counter_thingy.characters.name,
                  shortened: auction.counter_thingy.characters.shortened,
                }
              : null,
            dms:
              auction.counter_thingy.characters?.character_party.flatMap((party) =>
                party.parties.dm_party.map((dmParty) => ({
                  dm_id: dmParty.dms.id,
                  user_id: dmParty.dms.users.auth_user_uuid,
                  username: dmParty.dms.users.username,
                })),
              ) ?? [],
          }
        : null,
      dm: auction.dms
        ? {
            name: auction.dms.users.name,
            username: auction.dms.users.username,
          }
        : null,
    }));
  });
