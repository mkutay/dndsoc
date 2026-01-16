drop policy "Enable ALL for admins and DMs" on "public"."auction";

drop policy "Enable read based on auth" on "public"."auction";

create policy "Enable ALL for admins"
on "public"."auction"
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
on "public"."auction"
as permissive
for insert
to authenticated
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'dm'::role));


create policy "Enable read based on auth"
on "public"."auction"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM ((players
     JOIN characters ON ((players.id = characters.player_uuid)))
     JOIN thingy ON ((characters.id = thingy.character_id)))
  WHERE (auction.seller_thingy_id = thingy.id))) OR (( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'dm'::role)));



