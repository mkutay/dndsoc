alter table "public"."associates_requests" drop constraint "associates_requests_decision_by_fkey";

alter table "public"."associates_requests" drop constraint "associates_requests_decision_by_fkey1";

alter table "public"."associates_requests" add constraint "associates_requests_decision_by_fkey2" FOREIGN KEY (decision_by) REFERENCES admins(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."associates_requests" validate constraint "associates_requests_decision_by_fkey2";


