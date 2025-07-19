create type "public"."request_status" as enum ('approved', 'denied', 'pending');

create table "public"."associates_requests" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "email" text not null,
    "name" text not null,
    "notes" text not null default ''::text,
    "status" request_status not null default 'pending'::request_status,
    "user_id" uuid,
    "decision_by" uuid
);


alter table "public"."associates_requests" enable row level security;

alter table "public"."users" alter column "knumber" drop not null;

CREATE UNIQUE INDEX associates_requests_email_key ON public.associates_requests USING btree (email);

CREATE UNIQUE INDEX associates_requests_pkey ON public.associates_requests USING btree (id);

alter table "public"."associates_requests" add constraint "associates_requests_pkey" PRIMARY KEY using index "associates_requests_pkey";

alter table "public"."associates_requests" add constraint "associates_requests_decision_by_fkey" FOREIGN KEY (decision_by) REFERENCES users(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."associates_requests" validate constraint "associates_requests_decision_by_fkey";

alter table "public"."associates_requests" add constraint "associates_requests_decision_by_fkey1" FOREIGN KEY (decision_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."associates_requests" validate constraint "associates_requests_decision_by_fkey1";

alter table "public"."associates_requests" add constraint "associates_requests_email_key" UNIQUE using index "associates_requests_email_key";

alter table "public"."associates_requests" add constraint "associates_requests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."associates_requests" validate constraint "associates_requests_user_id_fkey";

alter table "public"."associates_requests" add constraint "associates_requests_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."associates_requests" validate constraint "associates_requests_user_id_fkey1";

grant delete on table "public"."associates_requests" to "anon";

grant insert on table "public"."associates_requests" to "anon";

grant references on table "public"."associates_requests" to "anon";

grant select on table "public"."associates_requests" to "anon";

grant trigger on table "public"."associates_requests" to "anon";

grant truncate on table "public"."associates_requests" to "anon";

grant update on table "public"."associates_requests" to "anon";

grant delete on table "public"."associates_requests" to "authenticated";

grant insert on table "public"."associates_requests" to "authenticated";

grant references on table "public"."associates_requests" to "authenticated";

grant select on table "public"."associates_requests" to "authenticated";

grant trigger on table "public"."associates_requests" to "authenticated";

grant truncate on table "public"."associates_requests" to "authenticated";

grant update on table "public"."associates_requests" to "authenticated";

grant delete on table "public"."associates_requests" to "service_role";

grant insert on table "public"."associates_requests" to "service_role";

grant references on table "public"."associates_requests" to "service_role";

grant select on table "public"."associates_requests" to "service_role";

grant trigger on table "public"."associates_requests" to "service_role";

grant truncate on table "public"."associates_requests" to "service_role";

grant update on table "public"."associates_requests" to "service_role";

create policy "Enable ALL for admins"
on "public"."associates_requests"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable insert for everyone"
on "public"."associates_requests"
as permissive
for insert
to public
with check (true);


create policy "Update for users based on auth id"
on "public"."associates_requests"
as permissive
for update
to authenticated
using ((( SELECT auth.jwt() ->> 'email' AS email) = email))
with check ((( SELECT auth.uid() AS uid) = user_id));