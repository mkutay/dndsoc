drop policy "Enable ALL for admins and DMs" on "public"."achievements";

drop policy "Enable ALL for admins and DMs" on "public"."characters";

create policy "Enable ALL for admins and DMs"
on "public"."achievements"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) <> 'player'::role));


create policy "Enable ALL for admins and DMs"
on "public"."characters"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM roles
  WHERE ((roles.auth_user_uuid = ( SELECT auth.uid() AS uid)) AND (roles.role <> 'player'::role)))))
with check ((EXISTS ( SELECT 1
   FROM roles
  WHERE ((roles.auth_user_uuid = ( SELECT auth.uid() AS uid)) AND (roles.role <> 'player'::role)))));



