alter table "public"."auction" add column "decision_by" uuid;

alter table "public"."auction" add constraint "auction_decision_by_fkey" FOREIGN KEY (decision_by) REFERENCES dms(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."auction" validate constraint "auction_decision_by_fkey";

create policy "Enable update for DMs"
on "public"."auction"
as permissive
for update
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'dm'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'dm'::role));



