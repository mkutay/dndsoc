create table "public"."when2dnd_polls" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "deadline" timestamp without time zone,
    "code" text not null,
    "date_from" timestamp with time zone not null,
    "date_to" timestamp with time zone not null,
    "title" text not null
);


alter table "public"."when2dnd_polls" enable row level security;

create table "public"."when2dnd_votes" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "auth_user_uuid" uuid default auth.uid(),
    "when2dnd_poll_id" uuid not null default gen_random_uuid(),
    "start" timestamp with time zone not null,
    "end" timestamp with time zone not null
);


alter table "public"."when2dnd_votes" enable row level security;

alter table "public"."characters" alter column "player_uuid" set not null;

alter table "public"."dms" alter column "auth_user_uuid" set not null;

alter table "public"."players" alter column "auth_user_uuid" set not null;

CREATE UNIQUE INDEX when2dnd_poll_code_key ON public.when2dnd_polls USING btree (code);

CREATE UNIQUE INDEX when2dnd_poll_pkey ON public.when2dnd_polls USING btree (id);

CREATE UNIQUE INDEX when2dnd_votes_pkey ON public.when2dnd_votes USING btree (id);

alter table "public"."when2dnd_polls" add constraint "when2dnd_poll_pkey" PRIMARY KEY using index "when2dnd_poll_pkey";

alter table "public"."when2dnd_votes" add constraint "when2dnd_votes_pkey" PRIMARY KEY using index "when2dnd_votes_pkey";

alter table "public"."when2dnd_polls" add constraint "when2dnd_poll_code_check" CHECK ((length(code) = 19)) not valid;

alter table "public"."when2dnd_polls" validate constraint "when2dnd_poll_code_check";

alter table "public"."when2dnd_polls" add constraint "when2dnd_poll_code_key" UNIQUE using index "when2dnd_poll_code_key";

alter table "public"."when2dnd_polls" add constraint "when2dnd_poll_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."when2dnd_polls" validate constraint "when2dnd_poll_created_by_fkey";

alter table "public"."when2dnd_polls" add constraint "when2dnd_poll_created_by_fkey1" FOREIGN KEY (created_by) REFERENCES roles(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."when2dnd_polls" validate constraint "when2dnd_poll_created_by_fkey1";

alter table "public"."when2dnd_polls" add constraint "when2dnd_poll_created_by_fkey2" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."when2dnd_polls" validate constraint "when2dnd_poll_created_by_fkey2";

alter table "public"."when2dnd_votes" add constraint "when2dnd_votes_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES users(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."when2dnd_votes" validate constraint "when2dnd_votes_auth_user_uuid_fkey";

alter table "public"."when2dnd_votes" add constraint "when2dnd_votes_auth_user_uuid_fkey1" FOREIGN KEY (auth_user_uuid) REFERENCES roles(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."when2dnd_votes" validate constraint "when2dnd_votes_auth_user_uuid_fkey1";

alter table "public"."when2dnd_votes" add constraint "when2dnd_votes_auth_user_uuid_fkey2" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."when2dnd_votes" validate constraint "when2dnd_votes_auth_user_uuid_fkey2";

alter table "public"."when2dnd_votes" add constraint "when2dnd_votes_when2dnd_poll_id_fkey" FOREIGN KEY (when2dnd_poll_id) REFERENCES when2dnd_polls(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."when2dnd_votes" validate constraint "when2dnd_votes_when2dnd_poll_id_fkey";

grant delete on table "public"."when2dnd_polls" to "anon";

grant insert on table "public"."when2dnd_polls" to "anon";

grant references on table "public"."when2dnd_polls" to "anon";

grant select on table "public"."when2dnd_polls" to "anon";

grant trigger on table "public"."when2dnd_polls" to "anon";

grant truncate on table "public"."when2dnd_polls" to "anon";

grant update on table "public"."when2dnd_polls" to "anon";

grant delete on table "public"."when2dnd_polls" to "authenticated";

grant insert on table "public"."when2dnd_polls" to "authenticated";

grant references on table "public"."when2dnd_polls" to "authenticated";

grant select on table "public"."when2dnd_polls" to "authenticated";

grant trigger on table "public"."when2dnd_polls" to "authenticated";

grant truncate on table "public"."when2dnd_polls" to "authenticated";

grant update on table "public"."when2dnd_polls" to "authenticated";

grant delete on table "public"."when2dnd_polls" to "service_role";

grant insert on table "public"."when2dnd_polls" to "service_role";

grant references on table "public"."when2dnd_polls" to "service_role";

grant select on table "public"."when2dnd_polls" to "service_role";

grant trigger on table "public"."when2dnd_polls" to "service_role";

grant truncate on table "public"."when2dnd_polls" to "service_role";

grant update on table "public"."when2dnd_polls" to "service_role";

grant delete on table "public"."when2dnd_votes" to "anon";

grant insert on table "public"."when2dnd_votes" to "anon";

grant references on table "public"."when2dnd_votes" to "anon";

grant select on table "public"."when2dnd_votes" to "anon";

grant trigger on table "public"."when2dnd_votes" to "anon";

grant truncate on table "public"."when2dnd_votes" to "anon";

grant update on table "public"."when2dnd_votes" to "anon";

grant delete on table "public"."when2dnd_votes" to "authenticated";

grant insert on table "public"."when2dnd_votes" to "authenticated";

grant references on table "public"."when2dnd_votes" to "authenticated";

grant select on table "public"."when2dnd_votes" to "authenticated";

grant trigger on table "public"."when2dnd_votes" to "authenticated";

grant truncate on table "public"."when2dnd_votes" to "authenticated";

grant update on table "public"."when2dnd_votes" to "authenticated";

grant delete on table "public"."when2dnd_votes" to "service_role";

grant insert on table "public"."when2dnd_votes" to "service_role";

grant references on table "public"."when2dnd_votes" to "service_role";

grant select on table "public"."when2dnd_votes" to "service_role";

grant trigger on table "public"."when2dnd_votes" to "service_role";

grant truncate on table "public"."when2dnd_votes" to "service_role";

grant update on table "public"."when2dnd_votes" to "service_role";

create policy "Enable ALL for admins and DMs"
on "public"."when2dnd_polls"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role));


create policy "Enable read access to auth"
on "public"."when2dnd_polls"
as permissive
for select
to authenticated
using (true);


create policy "Enable all based on auth"
on "public"."when2dnd_votes"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = auth_user_uuid))
with check ((( SELECT auth.uid() AS uid) = auth_user_uuid));


create policy "Enable read access for authenticated users"
on "public"."when2dnd_votes"
as permissive
for select
to authenticated
using (true);



