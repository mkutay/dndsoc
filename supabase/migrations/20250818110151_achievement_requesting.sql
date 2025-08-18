create policy "Enable ALL for DMs based on parties"
on "public"."achievement_requests_character"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM ((((characters c
     JOIN character_party cp ON ((c.id = cp.character_id)))
     JOIN parties p ON ((cp.party_id = p.id)))
     JOIN dm_party dp ON ((dp.party_id = p.id)))
     JOIN dms ON ((dp.dm_id = dms.id)))
  WHERE ((c.id = achievement_requests_character.character_id) AND (dms.auth_user_uuid = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM ((((characters c
     JOIN character_party cp ON ((c.id = cp.character_id)))
     JOIN parties p ON ((cp.party_id = p.id)))
     JOIN dm_party dp ON ((dp.party_id = p.id)))
     JOIN dms ON ((dp.dm_id = dms.id)))
  WHERE ((c.id = achievement_requests_character.character_id) AND (dms.auth_user_uuid = ( SELECT auth.uid() AS uid))))));


create policy "Enable all for admins"
on "public"."achievement_requests_dm"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'admin'::role));


create policy "Enable all for own DM"
on "public"."achievement_requests_dm"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM dms
  WHERE ((dms.id = achievement_requests_dm.dm_id) AND (dms.auth_user_uuid = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM dms
  WHERE ((dms.id = achievement_requests_dm.dm_id) AND (dms.auth_user_uuid = ( SELECT auth.uid() AS uid))))));


create policy "Enable ALL for admins"
on "public"."achievement_requests_player"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'admin'::role));


create policy "Enable all for DMs based on parties"
on "public"."achievement_requests_player"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM ((((characters c
     JOIN character_party cp ON ((c.id = cp.character_id)))
     JOIN parties p ON ((cp.party_id = p.id)))
     JOIN dm_party dp ON ((dp.party_id = p.id)))
     JOIN dms ON ((dp.dm_id = dms.id)))
  WHERE ((c.player_uuid = achievement_requests_player.player_id) AND (dms.auth_user_uuid = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM ((((characters c
     JOIN character_party cp ON ((c.id = cp.character_id)))
     JOIN parties p ON ((cp.party_id = p.id)))
     JOIN dm_party dp ON ((dp.party_id = p.id)))
     JOIN dms ON ((dp.dm_id = dms.id)))
  WHERE ((c.player_uuid = achievement_requests_player.player_id) AND (dms.auth_user_uuid = ( SELECT auth.uid() AS uid))))));


create policy "Enable all for own player"
on "public"."achievement_requests_player"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM players
  WHERE ((players.id = achievement_requests_player.player_id) AND (players.auth_user_uuid = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM players
  WHERE ((players.id = achievement_requests_player.player_id) AND (players.auth_user_uuid = ( SELECT auth.uid() AS uid))))));


create policy "Enable insert for DMs based on parties"
on "public"."dm_party"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM ((((characters c
     JOIN character_party cp ON ((c.id = cp.character_id)))
     JOIN parties p ON ((cp.party_id = p.id)))
     JOIN dm_party dp ON ((dp.party_id = p.id)))
     JOIN dms ON ((dp.dm_id = dms.id)))
  WHERE ((c.id = cp.character_id) AND (dms.auth_user_uuid = ( SELECT auth.uid() AS uid))))));



