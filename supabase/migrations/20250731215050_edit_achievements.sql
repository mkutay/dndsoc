drop policy "Enable ALL for admins and DMs" on "public"."achievements";

alter table "public"."achievements" alter column "description_long" set default ''::text;

alter table "public"."achievements" alter column "description_long" set not null;

alter table "public"."achievements" alter column "difficulty" set default 'easy'::difficulty;

alter table "public"."achievements" alter column "difficulty" set not null;

alter table "public"."achievements" alter column "points" set not null;

create policy "Enable ALL for admins"
on "public"."achievements"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'admin'::role));


create policy "Enable some achievements ALL for DMs"
on "public"."achievements"
as permissive
for all
to authenticated
using (((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'dm'::role) AND (type <> 'dm'::achievement_type)))
with check (((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'dm'::role) AND (type <> 'dm'::achievement_type)));



