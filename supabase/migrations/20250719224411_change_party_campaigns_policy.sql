drop policy "Enable ALL for admins" on "public"."party_campaigns";

create policy "Enable ALL for admins and DMs"
on "public"."party_campaigns"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) <> 'player'::role));



