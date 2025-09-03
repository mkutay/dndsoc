"use server";

import { errAsync, okAsync, safeTry } from "neverthrow";
import type z from "zod";

import { addThingySchema, editThingySchema } from "@/config/thingy";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery, runServiceQuery } from "@/utils/supabase-run";
import { convertToShortened } from "@/utils/formatting";
import { updateAuction, updateAuctionOffersOfAuction } from "@/lib/auction";
import { updateAuctionOffer } from "@/lib/auction-offers";

const getShortened = (name: string) =>
  safeTry(async function* () {
    let shortened = convertToShortened(name);
    const existing = yield* await runServiceQuery(
      (supabase) => supabase.from("thingy").select("id").eq("shortened", shortened).is("next", null).limit(1),
      "CHECK_THINGY_SHORTENED",
    );

    if (existing.length > 0) {
      shortened = `${shortened}-${crypto.randomUUID().substring(0, 4)}`; // make it unique
    }

    return okAsync(shortened);
  });

export const insertThingy = async (values: z.infer<typeof addThingySchema>) =>
  resultAsyncToActionResult(
    safeTry(async function* () {
      const parsed = yield* parseSchema(addThingySchema, values);
      const id = crypto.randomUUID();
      const shortened = yield* await getShortened(parsed.name);

      yield* await runQuery(
        (supabase) =>
          supabase.from("thingy").insert({
            id,
            name: parsed.name,
            description: parsed.description,
            tags: parsed.tags.map((tag) => tag.value),
            shortened,
            character_id: parsed.characterId,
            public: parsed.public,
          }),
        "INSERT_THINGY",
      );

      return okAsync({ shortened });
    }),
  );

const insert = (parsed: z.infer<typeof addThingySchema>, id: string, shortened: string) =>
  runQuery(
    (supabase) =>
      supabase.from("thingy").insert({
        id,
        name: parsed.name,
        description: parsed.description,
        tags: parsed.tags.map((tag) => tag.value),
        shortened,
        public: parsed.public,
      }),
    "INSERT_THINGY",
  );

const updatePrevious = (thingyId: string, newId: string) =>
  runQuery(
    (supabase) =>
      supabase
        .from("thingy")
        .update({
          next: newId,
        })
        .eq("id", thingyId),
    "UPDATE_THINGY",
  );

export const editThingy = async (values: z.infer<typeof editThingySchema>) =>
  resultAsyncToActionResult(
    safeTry(async function* () {
      const parsed = yield* parseSchema(editThingySchema, values);
      const shortened = yield* await getShortened(parsed.name);
      const newId = crypto.randomUUID();

      const thingy = yield* await runQuery(
        (supabase) =>
          supabase
            .from("thingy")
            .select("*, auctions(*), auction_offers(*, auctions(*))")
            .eq("id", values.thingyId)
            .neq("auctions.status", "listing_rejected")
            .neq("auctions.status", "withdrawn")
            .neq("auctions.status", "trade_rejected")
            .neq("auctions.status", "trade_approved")
            .neq("auction_offers.status", "rejected")
            .neq("auction_offers.status", "withdrawn")
            .is("auction.next", null)
            .single(),
        "FETCH_THINGY",
      );

      if (thingy.auctions.length > 1) {
        return errAsync({
          code: "THINGY_AUCTION_CONFLICT" as const,
          message: "This thingy is in multiple active auctions.",
        });
      }

      if (thingy.auction_offers.length > 1) {
        return errAsync({
          code: "THINGY_OFFERS_CONFLICT" as const,
          message: "This thingy is in multiple active offers.",
        });
      }

      if (thingy.auctions.length === 1) {
        if (thingy.auction_offers.length > 0) {
          return errAsync({
            code: "THINGY_IS_IN_OFFERS_AND_AUCTIONS" as const,
            message: "This thingy is in offers and auctions at the same time.",
          });
        }

        const auction = thingy.auctions[0];
        switch (auction.status) {
          case "created":
            parsed.public = true; // must be public if it's on auction
            yield* await insert(parsed, newId, shortened);
            yield* await updatePrevious(parsed.thingyId, newId);
            yield* await updateAuction(auction.id, {
              seller_thingy_id: newId,
              status: "created",
              seller_amount: auction.seller_amount,
            }).andThen(({ newId: newAuctionId }) =>
              // also update all offers to point to the new auction
              updateAuctionOffersOfAuction({ oldAuctionId: auction.id, newAuctionId }),
            );
            break;
          case "listing_approved":
            parsed.public = true; // must be public if it's on auction
            yield* await insert(parsed, newId, shortened);
            yield* await updatePrevious(parsed.thingyId, newId);
            // go to the amended state, since listing was only approved for the previous thingy
            yield* await updateAuction(auction.id, {
              seller_thingy_id: newId,
              status: "amended",
              seller_amount: auction.seller_amount,
            }).andThen(({ newId: newAuctionId }) =>
              // also update all offers to point to the new auction
              updateAuctionOffersOfAuction({ oldAuctionId: auction.id, newAuctionId }),
            );
            break;
          case "listing_rejected":
            // shouldn't be possible due to the query
            return errAsync({
              code: "THINGY_AUCTION_FINALISED" as const,
              message: "This thingy is in a finalised auction and cannot be edited.",
            });
          case "withdrawn":
            // shouldn't be possible due to the query
            return errAsync({
              code: "THINGY_AUCTION_FINALISED" as const,
              message: "This thingy is in a finalised auction and cannot be edited.",
            });
          case "offer_accepted":
            yield* await insert(parsed, newId, shortened);
            yield* await updatePrevious(parsed.thingyId, newId);
            // go to the amended state, since listing was only approved for the previous thingy
            yield* await updateAuction(auction.id, {
              seller_thingy_id: newId,
              status: "amended",
              seller_amount: auction.seller_amount,
            }).andThen(({ newId: newAuctionId }) =>
              // also update all offers to point to the new auction
              updateAuctionOffersOfAuction({ oldAuctionId: auction.id, newAuctionId, status: "rescinded" }),
            );
            break;
          case "trade_approved":
            return errAsync({
              code: "THINGY_AUCTION_FINALISED" as const,
              message: "This thingy is in a finalised auction and cannot be edited.",
            });
          case "trade_rejected":
            return errAsync({
              code: "THINGY_AUCTION_FINALISED" as const,
              message: "This thingy is in a finalised auction and cannot be edited.",
            });
          case "amended":
            yield* await insert(parsed, newId, shortened);
            yield* await updatePrevious(parsed.thingyId, newId);
            // go to the amended state, since listing was only approved for the previous thingy
            yield* await updateAuction(auction.id, {
              seller_thingy_id: newId,
              status: "amended",
              seller_amount: auction.seller_amount,
            }).andThen(({ newId: newAuctionId }) =>
              // also update all offers to point to the new auction
              updateAuctionOffersOfAuction({ oldAuctionId: auction.id, newAuctionId }),
            );
            break;
          default:
            const _exhaustiveCheck: never = auction.status;
            return _exhaustiveCheck;
        }
        return okAsync({ shortened });
      }

      if (thingy.auction_offers.length === 1) {
        const offer = thingy.auction_offers[0];
        switch (offer.status) {
          case "pending":
            parsed.public = true; // must be public if it's on an offer
            yield* await insert(parsed, newId, shortened);
            yield* await updatePrevious(parsed.thingyId, newId);
            yield* await updateAuctionOffer(offer.id, {
              status: "pending",
              amount: offer.amount,
              thingy_id: newId,
              auction_id: offer.auction_id,
            });
            break;
          case "rescinded":
            return errAsync({
              code: "THINGY_OFFER_RESCINDED" as const,
              message: "This thingy is in a rescinded offer and cannot be edited until rebid.",
            });
          case "amended":
            yield* await insert(parsed, newId, shortened);
            yield* await updatePrevious(parsed.thingyId, newId);
            yield* await updateAuctionOffer(offer.id, {
              status: "amended",
              amount: offer.amount,
              thingy_id: newId,
              auction_id: offer.auction_id,
            });
            break;
          case "accepted":
            yield* await insert(parsed, newId, shortened);
            yield* await updatePrevious(parsed.thingyId, newId);
            yield* await updateAuctionOffer(offer.id, {
              status: "amended",
              amount: offer.amount,
              thingy_id: newId,
              auction_id: offer.auction_id,
            });
            yield* await updateAuction(offer.auction_id, {
              seller_thingy_id: newId,
              status: "listing_approved",
              seller_amount: offer.auctions.seller_amount,
            }).andThen(({ newId: newAuctionId }) =>
              // also update all offers to point to the new auction
              updateAuctionOffersOfAuction({ oldAuctionId: offer.auction_id, newAuctionId }),
            );
            break;
          case "rejected":
            // shouldn't be possible due to the query
            return errAsync({
              code: "THINGY_OFFER_FINALISED" as const,
              message: "This thingy is in a finalised offer and cannot be edited.",
            });
          case "withdrawn":
            // shouldn't be possible due to the query
            return errAsync({
              code: "THINGY_OFFER_FINALISED" as const,
              message: "This thingy is in a finalised offer and cannot be edited.",
            });
          default:
            const _exhaustiveCheck: never = offer.status;
            return _exhaustiveCheck;
        }

        return okAsync({ shortened });
      }

      yield* await insert(parsed, newId, shortened);
      yield* await updatePrevious(parsed.thingyId, newId);

      return okAsync({ shortened });
    }),
  );
