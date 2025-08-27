alter table "public"."achievement_requests_dm" drop constraint "achievement_requests_dm_decision_by_admin_fkey";

alter table "public"."achievement_requests_dm" add constraint "achievement_requests_dm_decision_by_admin_fkey1" FOREIGN KEY (decision_by_admin) REFERENCES admins(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."achievement_requests_dm" validate constraint "achievement_requests_dm_decision_by_admin_fkey1";


