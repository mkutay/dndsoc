drop policy "Enable read based on auth and auction" on "public"."thingy";

alter table "public"."auction" drop constraint "auction_buyer_id_fkey";

alter table "public"."auction" drop constraint "auction_previous_fkey";

alter table "public"."auction" drop constraint "auction_seller_id_fkey";

alter table "public"."auction" drop constraint "auction_thingy_id_fkey";

alter table "public"."auction" drop column "buyer_id";

alter table "public"."auction" drop column "previous";

alter table "public"."auction" drop column "seller_id";

alter table "public"."auction" drop column "thingy_id";

alter table "public"."auction" add column "buyer_thingy_id" uuid;

alter table "public"."auction" add column "seller_thingy_id" uuid not null;

alter table "public"."auction" add constraint "auction_buyer_thingy_id_fkey" FOREIGN KEY (buyer_thingy_id) REFERENCES thingy(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."auction" validate constraint "auction_buyer_thingy_id_fkey";

alter table "public"."auction" add constraint "auction_seller_thingy_id_fkey" FOREIGN KEY (seller_thingy_id) REFERENCES thingy(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."auction" validate constraint "auction_seller_thingy_id_fkey";

create policy "Enable ALL for admins and DMs"
on "public"."auction"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) <> 'player'::role));


create policy "Enable insert based on auth"
on "public"."auction"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM ((players
     JOIN characters ON ((players.id = characters.player_uuid)))
     JOIN thingy ON ((characters.id = thingy.character_id)))
  WHERE (auction.seller_thingy_id = thingy.id))));


create policy "Enable read access for public ones"
on "public"."auction"
as permissive
for select
to public
using (((valid = true) AND (next IS NULL) AND ((status = 'listing_approved'::auction_state) OR (status = 'buy_request'::auction_state))));


create policy "Enable read based on auth"
on "public"."auction"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM ((players
     JOIN characters ON ((players.id = characters.player_uuid)))
     JOIN thingy ON ((characters.id = thingy.character_id)))
  WHERE (auction.seller_thingy_id = thingy.id))));


create policy "Enable read based on auth and auction"
on "public"."thingy"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (players
     JOIN characters ON ((characters.player_uuid = players.id)))
  WHERE (thingy.character_id = characters.id))));



