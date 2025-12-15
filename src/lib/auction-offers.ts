import { okAsync, safeTry } from "neverthrow";

import type { Enums } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";
import { supabaseRun } from "@/utils/supabase-run";

export const updateAuctionOffer = (
  offerId: string,
  {
    status,
    amount,
    thingy_id,
    auction_id,
  }: {
    status: Enums<"auction_offer_status">;
    amount: number;
    thingy_id: string;
    auction_id: string;
  },
) =>
  safeTry(async function* () {
    const newId = crypto.randomUUID();
    const supabase = yield* await createClient();

    yield* await supabaseRun(
      supabase.from("auction_offers").insert({
        id: newId,
        auction_id,
        status,
        amount,
        thingy_id,
      }),
      "UPDATE_OFFER",
    );

    yield* await supabaseRun(
      supabase.from("auction_offers").update({ next: newId }).eq("id", offerId),
      "CLOSE_OLD_OFFER",
    );

    return okAsync();
  });
