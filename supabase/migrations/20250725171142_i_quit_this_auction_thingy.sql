drop policy "Enable insert based on auth" on "public"."auction";

alter table "public"."auction" drop column "amount";

alter table "public"."auction" add column "buyer_amount" bigint;

alter table "public"."auction" add column "seller_amount" bigint not null default '1'::bigint;

create policy "Enable update for buy request"
on "public"."auction"
as permissive
for update
to authenticated
using ((status = 'listing_approved'::auction_state))
with check ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (((players
     JOIN characters ON ((players.id = characters.player_uuid)))
     JOIN thingy ON ((characters.id = thingy.character_id)))
     JOIN auction ab ON ((thingy.id = auction.buyer_thingy_id)))
  WHERE (ab.id = auction.next))));


create policy "Enable update for signing off a buy request"
on "public"."auction"
as permissive
for update
to authenticated
using ((status = 'buy_request'::auction_state))
with check ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (((players
     JOIN characters ON ((players.id = characters.player_uuid)))
     JOIN thingy ON ((characters.id = thingy.character_id)))
     JOIN auction ab ON ((thingy.id = auction.seller_thingy_id)))
  WHERE (ab.id = auction.next))));


create policy "Enable insert based on auth"
on "public"."auction"
as permissive
for insert
to authenticated
with check (((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM ((players
     JOIN characters ON ((players.id = characters.player_uuid)))
     JOIN thingy ON ((characters.id = thingy.character_id)))
  WHERE (auction.seller_thingy_id = thingy.id))) OR (( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM ((players
     JOIN characters ON ((players.id = characters.player_uuid)))
     JOIN thingy ON ((characters.id = thingy.character_id)))
  WHERE (auction.buyer_thingy_id = thingy.id)))));



