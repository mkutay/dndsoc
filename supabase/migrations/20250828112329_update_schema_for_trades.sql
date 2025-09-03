create type "public"."auction_offer_status" as enum ('pending', 'rejected', 'accepted', 'withdrawn', 'rescinded');

create type "public"."auction_status" as enum ('created', 'listing_approved', 'listing_rejected', 'offer_accepted', 'trade_approved', 'trade_rejected');

drop policy "Enable insert based on auth" on "public"."auction";

drop policy "Enable read access for public ones" on "public"."auction";

drop policy "Enable update for buy request" on "public"."auction";

drop policy "Enable update for signing off a buy request" on "public"."auction";

alter table "public"."auction" drop constraint "auction_buyer_thingy_id_fkey";

alter table "public"."auction" drop constraint "auction_decision_by_fkey";


  create table "public"."auction_decisions" (
    "auction_id" uuid not null,
    "dm_id" uuid not null
      );


alter table "public"."auction_decisions" enable row level security;


  create table "public"."auction_offers" (
    "auction_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "thingy_id" uuid not null,
    "amount" bigint not null default '1'::bigint,
    "offer_id" uuid not null default gen_random_uuid(),
    "next" uuid,
    "status" auction_offer_status not null default 'pending'::auction_offer_status
      );


alter table "public"."auction_offers" enable row level security;

alter table "public"."auction" drop column "buyer_amount";

alter table "public"."auction" drop column "buyer_thingy_id";

alter table "public"."auction" drop column "decision_by";

alter table "public"."auction" drop column "status";

alter table "public"."auction" add column "status" auction_status not null default 'created'::auction_status;

drop type "public"."auction_state";

CREATE UNIQUE INDEX auction_decisions_pkey ON public.auction_decisions USING btree (auction_id, dm_id);

CREATE UNIQUE INDEX auction_offers_pkey ON public.auction_offers USING btree (offer_id);

alter table "public"."auction_decisions" add constraint "auction_decisions_pkey" PRIMARY KEY using index "auction_decisions_pkey";

alter table "public"."auction_offers" add constraint "auction_offers_pkey" PRIMARY KEY using index "auction_offers_pkey";

alter table "public"."auction_decisions" add constraint "auction_decisions_auction_id_fkey" FOREIGN KEY (auction_id) REFERENCES auction(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."auction_decisions" validate constraint "auction_decisions_auction_id_fkey";

alter table "public"."auction_decisions" add constraint "auction_decisions_dm_id_fkey" FOREIGN KEY (dm_id) REFERENCES dms(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."auction_decisions" validate constraint "auction_decisions_dm_id_fkey";

alter table "public"."auction_offers" add constraint "auction_offers_auction_id_fkey" FOREIGN KEY (auction_id) REFERENCES auction(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."auction_offers" validate constraint "auction_offers_auction_id_fkey";

alter table "public"."auction_offers" add constraint "auction_offers_next_fkey" FOREIGN KEY (next) REFERENCES auction_offers(offer_id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."auction_offers" validate constraint "auction_offers_next_fkey";

alter table "public"."auction_offers" add constraint "auction_offers_thingy_id_fkey" FOREIGN KEY (thingy_id) REFERENCES thingy(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."auction_offers" validate constraint "auction_offers_thingy_id_fkey";

grant delete on table "public"."auction_decisions" to "anon";

grant insert on table "public"."auction_decisions" to "anon";

grant references on table "public"."auction_decisions" to "anon";

grant select on table "public"."auction_decisions" to "anon";

grant trigger on table "public"."auction_decisions" to "anon";

grant truncate on table "public"."auction_decisions" to "anon";

grant update on table "public"."auction_decisions" to "anon";

grant delete on table "public"."auction_decisions" to "authenticated";

grant insert on table "public"."auction_decisions" to "authenticated";

grant references on table "public"."auction_decisions" to "authenticated";

grant select on table "public"."auction_decisions" to "authenticated";

grant trigger on table "public"."auction_decisions" to "authenticated";

grant truncate on table "public"."auction_decisions" to "authenticated";

grant update on table "public"."auction_decisions" to "authenticated";

grant delete on table "public"."auction_decisions" to "service_role";

grant insert on table "public"."auction_decisions" to "service_role";

grant references on table "public"."auction_decisions" to "service_role";

grant select on table "public"."auction_decisions" to "service_role";

grant trigger on table "public"."auction_decisions" to "service_role";

grant truncate on table "public"."auction_decisions" to "service_role";

grant update on table "public"."auction_decisions" to "service_role";

grant delete on table "public"."auction_offers" to "anon";

grant insert on table "public"."auction_offers" to "anon";

grant references on table "public"."auction_offers" to "anon";

grant select on table "public"."auction_offers" to "anon";

grant trigger on table "public"."auction_offers" to "anon";

grant truncate on table "public"."auction_offers" to "anon";

grant update on table "public"."auction_offers" to "anon";

grant delete on table "public"."auction_offers" to "authenticated";

grant insert on table "public"."auction_offers" to "authenticated";

grant references on table "public"."auction_offers" to "authenticated";

grant select on table "public"."auction_offers" to "authenticated";

grant trigger on table "public"."auction_offers" to "authenticated";

grant truncate on table "public"."auction_offers" to "authenticated";

grant update on table "public"."auction_offers" to "authenticated";

grant delete on table "public"."auction_offers" to "service_role";

grant insert on table "public"."auction_offers" to "service_role";

grant references on table "public"."auction_offers" to "service_role";

grant select on table "public"."auction_offers" to "service_role";

grant trigger on table "public"."auction_offers" to "service_role";

grant truncate on table "public"."auction_offers" to "service_role";

grant update on table "public"."auction_offers" to "service_role";


