drop policy "Enable ALL for DMs based on Auth" on "public"."dm_party";

drop policy "Enable ALL for admins" on "public"."dm_party";

create policy "Enable ALL for admins and DMs"
on "public"."dm_party"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) <> 'player'::role));



