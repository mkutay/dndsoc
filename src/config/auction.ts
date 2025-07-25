import z from "zod";

import type { Enums } from "@/types/database.types";

export const addToAuctionSchema = z.object({
  thingyId: z.uuid(),
  amount: z.number().min(1),
});

export const buyThingySchema = z.object({
  auctionId: z.uuid(),
  thingyId: z.uuid(),
  amount: z.number().min(1),
});

export const statusPretty: Record<Enums<"auction_state">, string> = {
  created: "Created",
  deleted: "Deleted",
  listing_approved: "Listing Approved",
  listing_rejected: "Listing Rejected",
  buy_request: "Buy Request",
  signed_off: "Signed Off",
  buy_request_rejected: "Buy Request Rejected",
  deal_completed: "Deal Completed",
  final_deal_rejected: "Final Deal Rejected",
};

export const statusVariant: Record<Enums<"auction_state">, "default" | "secondary" | "destructive"> = {
  created: "secondary",
  deleted: "destructive",
  listing_approved: "default",
  listing_rejected: "destructive",
  buy_request: "default",
  buy_request_rejected: "destructive",
  signed_off: "default",
  deal_completed: "default",
  final_deal_rejected: "destructive",
};

export const statusMeaning: Record<Enums<"auction_state">, string> = {
  created: "Auction created but not yet approved.",
  deleted: "Deleted auction.",
  listing_approved: "Auction listing approved by DM/admin and is visible.",
  listing_rejected: "Auction listing rejected by DM/admin.",
  buy_request: "Another person has requested to buy the auction item in return for another thingy.",
  buy_request_rejected: "Buy request has been rejected by the auction owner.",
  signed_off: "Auction has been signed off by both characters.",
  deal_completed:
    "Deal has been completed and approved by both DMs/admin of the characters. The auction is now closed.",
  final_deal_rejected: "Final deal has been rejected by one of the DMs/admins.",
};

export const statusAlertDialog: Record<Enums<"auction_state">, { approve: string; reject: string }> = {
  created: {
    approve:
      "This will approve the auction and make it visible to all users. The auction will be live and can be interacted with.",
    reject:
      "This will reject the auction and notify the user. The auction will not be visible to anyone. This action cannot be undone.",
  },
  deleted: {
    approve: "This will restore the deleted auction.",
    reject: "This will permanently delete the auction.",
  },
  listing_approved: {
    approve: "This auction is already approved.",
    reject: "This will reject the approved listing.",
  },
  listing_rejected: {
    approve: "This will approve the previously rejected listing.",
    reject: "This auction is already rejected.",
  },
  buy_request: {
    approve: "This will approve the buy request and move to signed off status.",
    reject: "This will reject the buy request and notify the buyer.",
  },
  buy_request_rejected: {
    approve: "This will approve the previously rejected buy request.",
    reject: "This buy request is already rejected.",
  },
  signed_off: {
    approve:
      "This will approve the trade and the auction will be closed. The auction will be closed and the items will be exchanged.",
    reject:
      "This will reject the trade and notify the users. The auction will not be closed and the items will not be exchanged.",
  },
  deal_completed: {
    approve: "This deal is already completed.",
    reject: "This will reject the completed deal.",
  },
  final_deal_rejected: {
    approve: "This will approve the previously rejected deal.",
    reject: "This deal is already rejected.",
  },
};

export type ProcessedAuction = {
  id: string;
  status: Enums<"auction_state">;
  created_at: string;
  valid: boolean;
  next: string | null;
  seller_amount: number;
  buyer_amount: number | null;
  sold_thingy: {
    created_at: string;
    description: string;
    id: string;
    name: string;
    next: string | null;
    public: boolean;
    shortened: string;
    tags: string[];
    character: {
      id: string;
      name: string;
      shortened: string;
    } | null;
    dms: Array<{
      dm_id: string;
      user_id: string;
      username: string;
    }>;
  };
  counter_thingy: {
    created_at: string;
    description: string;
    id: string;
    name: string;
    next: string | null;
    public: boolean;
    shortened: string;
    tags: string[];
    character: {
      id: string;
      name: string;
      shortened: string;
    } | null;
    dms: Array<{
      dm_id: string;
      user_id: string;
      username: string;
    }>;
  } | null;
  dm: {
    name: string;
    username: string;
  } | null;
};
