drop policy "Enable insert based on auth" on "public"."character_owns";

drop policy "Enable read for based on auth" on "public"."character_owns";

drop policy "Enable read for public ones" on "public"."character_owns";

drop policy "Enable ALL for admins" on "public"."thingy";

drop policy "Enable insert for authenticated users only" on "public"."thingy";

drop policy "Enable read access for all users" on "public"."thingy";

revoke delete on table "public"."character_owns" from "anon";

revoke insert on table "public"."character_owns" from "anon";

revoke references on table "public"."character_owns" from "anon";

revoke select on table "public"."character_owns" from "anon";

revoke trigger on table "public"."character_owns" from "anon";

revoke truncate on table "public"."character_owns" from "anon";

revoke update on table "public"."character_owns" from "anon";

revoke delete on table "public"."character_owns" from "authenticated";

revoke insert on table "public"."character_owns" from "authenticated";

revoke references on table "public"."character_owns" from "authenticated";

revoke select on table "public"."character_owns" from "authenticated";

revoke trigger on table "public"."character_owns" from "authenticated";

revoke truncate on table "public"."character_owns" from "authenticated";

revoke update on table "public"."character_owns" from "authenticated";

revoke delete on table "public"."character_owns" from "service_role";

revoke insert on table "public"."character_owns" from "service_role";

revoke references on table "public"."character_owns" from "service_role";

revoke select on table "public"."character_owns" from "service_role";

revoke trigger on table "public"."character_owns" from "service_role";

revoke truncate on table "public"."character_owns" from "service_role";

revoke update on table "public"."character_owns" from "service_role";

alter table "public"."character_owns" drop constraint "character_owns_character_id_fkey";

alter table "public"."character_owns" drop constraint "character_owns_thingy_id_fkey";

alter table "public"."thingy" drop constraint "thingy_shortened_key";

alter table "public"."character_owns" drop constraint "character_owns_pkey";

drop index if exists "public"."character_owns_pkey";

drop index if exists "public"."thingy_shortened_key";

drop table "public"."character_owns";

alter table "public"."auction" add column "amount" bigint not null default '1'::bigint;

alter table "public"."thingy" drop column "amount";

alter table "public"."thingy" add column "character_id" uuid;

alter table "public"."thingy" add column "next" uuid;

alter table "public"."thingy" add column "public" boolean not null default false;

alter table "public"."thingy" add constraint "thingy_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."thingy" validate constraint "thingy_character_id_fkey";

alter table "public"."thingy" add constraint "thingy_next_fkey" FOREIGN KEY (next) REFERENCES thingy(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."thingy" validate constraint "thingy_next_fkey";

create policy "Enable ALL for admins and DMs"
on "public"."thingy"
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
on "public"."thingy"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (players
     JOIN characters ON ((characters.player_uuid = players.id)))
  WHERE (thingy.character_id = characters.id))));


create policy "Enable read access for public ones"
on "public"."thingy"
as permissive
for select
to public
using ((public = true));


create policy "Enable read based on auth and auction"
on "public"."thingy"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (players
     JOIN characters ON ((characters.player_uuid = players.id)))
  WHERE (thingy.character_id = characters.id))) OR (( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM ((players
     JOIN characters ON ((characters.player_uuid = players.id)))
     JOIN auction ON ((characters.id = auction.buyer_id)))
  WHERE (thingy.id = auction.thingy_id)))));


create policy "Enable update based on auth"
on "public"."thingy"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (players
     JOIN characters ON ((characters.player_uuid = players.id)))
  WHERE (thingy.character_id = characters.id))))
with check ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (players
     JOIN characters ON ((characters.player_uuid = players.id)))
  WHERE (thingy.character_id = characters.id))));



