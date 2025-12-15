drop policy "Enable ALL for admins" on "public"."auction";

drop policy "Enable insert for DMs" on "public"."auction";

drop policy "Enable read based on auth" on "public"."auction";

drop policy "Enable update for DMs" on "public"."auction";

revoke delete on table "public"."auction" from "anon";

revoke insert on table "public"."auction" from "anon";

revoke references on table "public"."auction" from "anon";

revoke select on table "public"."auction" from "anon";

revoke trigger on table "public"."auction" from "anon";

revoke truncate on table "public"."auction" from "anon";

revoke update on table "public"."auction" from "anon";

revoke delete on table "public"."auction" from "authenticated";

revoke insert on table "public"."auction" from "authenticated";

revoke references on table "public"."auction" from "authenticated";

revoke select on table "public"."auction" from "authenticated";

revoke trigger on table "public"."auction" from "authenticated";

revoke truncate on table "public"."auction" from "authenticated";

revoke update on table "public"."auction" from "authenticated";

revoke delete on table "public"."auction" from "service_role";

revoke insert on table "public"."auction" from "service_role";

revoke references on table "public"."auction" from "service_role";

revoke select on table "public"."auction" from "service_role";

revoke trigger on table "public"."auction" from "service_role";

revoke truncate on table "public"."auction" from "service_role";

revoke update on table "public"."auction" from "service_role";

alter table "public"."auction" drop constraint "auction_next_fkey";

alter table "public"."auction" drop constraint "auction_seller_thingy_id_fkey";

alter table "public"."auction_decisions" drop constraint "auction_decisions_auction_id_fkey";

alter table "public"."auction_offers" drop constraint "auction_offers_auction_id_fkey";

alter table "public"."auction_offers" drop constraint "auction_offers_next_fkey";

alter table "public"."auction" drop constraint "auction_pkey";

alter table "public"."auction_offers" drop constraint "auction_offers_pkey";

drop index if exists "public"."auction_offers_pkey";

drop index if exists "public"."auction_pkey";

drop table "public"."auction";

alter type "public"."auction_offer_status" rename to "auction_offer_status__old_version_to_be_dropped";

create type "public"."auction_offer_status" as enum ('pending', 'rejected', 'accepted', 'withdrawn', 'rescinded', 'amended');

alter type "public"."auction_status" rename to "auction_status__old_version_to_be_dropped";

create type "public"."auction_status" as enum ('created', 'listing_approved', 'listing_rejected', 'offer_accepted', 'trade_approved', 'trade_rejected', 'amended', 'withdrawn');


  create table "public"."auctions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "next" uuid,
    "seller_thingy_id" uuid not null,
    "seller_amount" bigint not null,
    "status" auction_status not null
      );


alter table "public"."auctions" enable row level security;

alter table "public"."auction_offers" alter column status type "public"."auction_offer_status" using status::text::"public"."auction_offer_status";

drop type "public"."auction_offer_status__old_version_to_be_dropped";

drop type "public"."auction_status__old_version_to_be_dropped";

alter table "public"."auction_offers" drop column "offer_id";

alter table "public"."auction_offers" add column "id" uuid not null default gen_random_uuid();

alter table "public"."auction_offers" alter column "amount" drop default;

alter table "public"."auction_offers" alter column "status" drop default;

alter table "public"."thingy" alter column "public" drop default;

CREATE UNIQUE INDEX auction_offers_next_key ON public.auction_offers USING btree (next);

CREATE UNIQUE INDEX auctions_next_key ON public.auctions USING btree (next);

CREATE UNIQUE INDEX thingy_next_key ON public.thingy USING btree (next);

CREATE UNIQUE INDEX auction_offers_pkey ON public.auction_offers USING btree (id);

CREATE UNIQUE INDEX auction_pkey ON public.auctions USING btree (id);

alter table "public"."auctions" add constraint "auction_pkey" PRIMARY KEY using index "auction_pkey";

alter table "public"."auction_offers" add constraint "auction_offers_pkey" PRIMARY KEY using index "auction_offers_pkey";

alter table "public"."auction_offers" add constraint "auction_offers_next_key" UNIQUE using index "auction_offers_next_key";

alter table "public"."auctions" add constraint "auction_next_fkey" FOREIGN KEY (next) REFERENCES auctions(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."auctions" validate constraint "auction_next_fkey";

alter table "public"."auctions" add constraint "auction_seller_thingy_id_fkey" FOREIGN KEY (seller_thingy_id) REFERENCES thingy(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."auctions" validate constraint "auction_seller_thingy_id_fkey";

alter table "public"."auctions" add constraint "auctions_next_key" UNIQUE using index "auctions_next_key";

alter table "public"."thingy" add constraint "thingy_next_key" UNIQUE using index "thingy_next_key";

alter table "public"."auction_decisions" add constraint "auction_decisions_auction_id_fkey" FOREIGN KEY (auction_id) REFERENCES auctions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."auction_decisions" validate constraint "auction_decisions_auction_id_fkey";

alter table "public"."auction_offers" add constraint "auction_offers_auction_id_fkey" FOREIGN KEY (auction_id) REFERENCES auctions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."auction_offers" validate constraint "auction_offers_auction_id_fkey";

alter table "public"."auction_offers" add constraint "auction_offers_next_fkey" FOREIGN KEY (next) REFERENCES auction_offers(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."auction_offers" validate constraint "auction_offers_next_fkey";

grant delete on table "public"."auctions" to "anon";

grant insert on table "public"."auctions" to "anon";

grant references on table "public"."auctions" to "anon";

grant select on table "public"."auctions" to "anon";

grant trigger on table "public"."auctions" to "anon";

grant truncate on table "public"."auctions" to "anon";

grant update on table "public"."auctions" to "anon";

grant delete on table "public"."auctions" to "authenticated";

grant insert on table "public"."auctions" to "authenticated";

grant references on table "public"."auctions" to "authenticated";

grant select on table "public"."auctions" to "authenticated";

grant trigger on table "public"."auctions" to "authenticated";

grant truncate on table "public"."auctions" to "authenticated";

grant update on table "public"."auctions" to "authenticated";

grant delete on table "public"."auctions" to "service_role";

grant insert on table "public"."auctions" to "service_role";

grant references on table "public"."auctions" to "service_role";

grant select on table "public"."auctions" to "service_role";

grant trigger on table "public"."auctions" to "service_role";

grant truncate on table "public"."auctions" to "service_role";

grant update on table "public"."auctions" to "service_role";


  create policy "Enable ALL for admins"
  on "public"."auctions"
  as permissive
  for all
  to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'admin'::role));



  create policy "Enable insert for DMs"
  on "public"."auctions"
  as permissive
  for insert
  to authenticated
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'dm'::role));



  create policy "Enable read based on auth"
  on "public"."auctions"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM ((players
     JOIN characters ON ((players.id = characters.player_uuid)))
     JOIN thingy ON ((characters.id = thingy.character_id)))
  WHERE (auctions.seller_thingy_id = thingy.id))) OR (( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'dm'::role)));



  create policy "Enable update for DMs"
  on "public"."auctions"
  as permissive
  for update
  to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'dm'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'dm'::role));



