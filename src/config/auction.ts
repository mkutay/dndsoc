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

export const statusPretty: Record<Enums<"auction_status">, string> = {
  created: "Created",
  listing_approved: "Listing Approved",
  listing_rejected: "Listing Rejected",
  offer_accepted: "Offer Accepted",
  trade_approved: "Trade Approved",
  trade_rejected: "Trade Rejected",
  amended: "Amended",
  withdrawn: "Withdrawn",
};

export const statusVariant: Record<Enums<"auction_status">, "default" | "secondary" | "destructive"> = {
  created: "secondary",
  listing_approved: "default",
  listing_rejected: "destructive",
  offer_accepted: "default",
  trade_approved: "default",
  trade_rejected: "destructive",
  amended: "default",
  withdrawn: "destructive",
};

export const statusMeaning: Record<Enums<"auction_status">, string> = {
  created: "Auction created but not yet approved.",
  listing_approved: "Auction listing approved by DM/admin and is visible.",
  listing_rejected: "Auction listing rejected by DM/admin.",
  offer_accepted: "An offer has been accepted and trade is in progress.",
  trade_approved: "Trade has been approved by both DMs/admins. The auction is now closed.",
  trade_rejected: "Trade has been rejected by one of the DMs/admins.",
  amended: "The auction or offer has been amended.",
  withdrawn: "The auction has been withdrawn by the seller.",
};

export const statusAlertDialog: Record<Enums<"auction_status">, { approve: string; reject: string }> = {
  created: {
    approve:
      "This will approve the auction and make it visible to all users. The auction will be live and can be interacted with.",
    reject:
      "This will reject the auction and notify the user. The auction will not be visible to anyone. This action cannot be undone.",
  },
  listing_approved: {
    approve: "This auction is already approved.",
    reject: "This will reject the approved listing.",
  },
  listing_rejected: {
    approve: "This will approve the previously rejected listing.",
    reject: "This auction is already rejected.",
  },
  offer_accepted: {
    approve: "This will approve the accepted offer and move to trade approval.",
    reject: "This will reject the accepted offer.",
  },
  trade_approved: {
    approve: "This trade is already approved.",
    reject: "This will reject the approved trade.",
  },
  trade_rejected: {
    approve: "This will approve the previously rejected trade.",
    reject: "This trade is already rejected.",
  },
  amended: {
    approve: "This will approve the amended auction/offer.",
    reject: "This will reject the amended auction/offer.",
  },
  withdrawn: {
    approve: "This will restore the withdrawn auction.",
    reject: "This auction is already withdrawn.",
  },
};

export type ProcessedAuction = {
  id: string;
  status: Enums<"auction_status">;
  created_at: string;
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
