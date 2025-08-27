create table "public"."achievement_requests_character" (
    "achievement_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "character_id" uuid not null,
    "decision_by_dm" uuid,
    "status" request_status not null default 'pending'::request_status
);


alter table "public"."achievement_requests_character" enable row level security;

create table "public"."achievement_requests_dm" (
    "achievement_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "dm_id" uuid not null,
    "decision_by_admin" uuid,
    "status" request_status not null default 'pending'::request_status
);


alter table "public"."achievement_requests_dm" enable row level security;

create table "public"."achievement_requests_player" (
    "achievement_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "player_id" uuid not null,
    "decision_by_dm" uuid,
    "status" request_status not null default 'pending'::request_status
);


alter table "public"."achievement_requests_player" enable row level security;

CREATE UNIQUE INDEX achievement_requests_dm_pkey ON public.achievement_requests_dm USING btree (achievement_id, dm_id);

CREATE UNIQUE INDEX achievement_requests_pkey ON public.achievement_requests_character USING btree (achievement_id, character_id);

CREATE UNIQUE INDEX achievement_requests_player_pkey ON public.achievement_requests_player USING btree (achievement_id, player_id);

alter table "public"."achievement_requests_character" add constraint "achievement_requests_pkey" PRIMARY KEY using index "achievement_requests_pkey";

alter table "public"."achievement_requests_dm" add constraint "achievement_requests_dm_pkey" PRIMARY KEY using index "achievement_requests_dm_pkey";

alter table "public"."achievement_requests_player" add constraint "achievement_requests_player_pkey" PRIMARY KEY using index "achievement_requests_player_pkey";

alter table "public"."achievement_requests_character" add constraint "achievement_requests_achievement_id_fkey" FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."achievement_requests_character" validate constraint "achievement_requests_achievement_id_fkey";

alter table "public"."achievement_requests_character" add constraint "achievement_requests_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."achievement_requests_character" validate constraint "achievement_requests_character_id_fkey";

alter table "public"."achievement_requests_character" add constraint "achievement_requests_decision_by_dm_fkey" FOREIGN KEY (decision_by_dm) REFERENCES dms(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."achievement_requests_character" validate constraint "achievement_requests_decision_by_dm_fkey";

alter table "public"."achievement_requests_dm" add constraint "achievement_requests_dm_achievement_id_fkey" FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."achievement_requests_dm" validate constraint "achievement_requests_dm_achievement_id_fkey";

alter table "public"."achievement_requests_dm" add constraint "achievement_requests_dm_decision_by_admin_fkey" FOREIGN KEY (decision_by_admin) REFERENCES users(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."achievement_requests_dm" validate constraint "achievement_requests_dm_decision_by_admin_fkey";

alter table "public"."achievement_requests_dm" add constraint "achievement_requests_dm_dm_id_fkey" FOREIGN KEY (dm_id) REFERENCES dms(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."achievement_requests_dm" validate constraint "achievement_requests_dm_dm_id_fkey";

alter table "public"."achievement_requests_player" add constraint "achievement_requests_player_achievement_id_fkey" FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."achievement_requests_player" validate constraint "achievement_requests_player_achievement_id_fkey";

alter table "public"."achievement_requests_player" add constraint "achievement_requests_player_decision_by_dm_fkey" FOREIGN KEY (decision_by_dm) REFERENCES dms(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."achievement_requests_player" validate constraint "achievement_requests_player_decision_by_dm_fkey";

alter table "public"."achievement_requests_player" add constraint "achievement_requests_player_player_id_fkey" FOREIGN KEY (player_id) REFERENCES players(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."achievement_requests_player" validate constraint "achievement_requests_player_player_id_fkey";

grant delete on table "public"."achievement_requests_character" to "anon";

grant insert on table "public"."achievement_requests_character" to "anon";

grant references on table "public"."achievement_requests_character" to "anon";

grant select on table "public"."achievement_requests_character" to "anon";

grant trigger on table "public"."achievement_requests_character" to "anon";

grant truncate on table "public"."achievement_requests_character" to "anon";

grant update on table "public"."achievement_requests_character" to "anon";

grant delete on table "public"."achievement_requests_character" to "authenticated";

grant insert on table "public"."achievement_requests_character" to "authenticated";

grant references on table "public"."achievement_requests_character" to "authenticated";

grant select on table "public"."achievement_requests_character" to "authenticated";

grant trigger on table "public"."achievement_requests_character" to "authenticated";

grant truncate on table "public"."achievement_requests_character" to "authenticated";

grant update on table "public"."achievement_requests_character" to "authenticated";

grant delete on table "public"."achievement_requests_character" to "service_role";

grant insert on table "public"."achievement_requests_character" to "service_role";

grant references on table "public"."achievement_requests_character" to "service_role";

grant select on table "public"."achievement_requests_character" to "service_role";

grant trigger on table "public"."achievement_requests_character" to "service_role";

grant truncate on table "public"."achievement_requests_character" to "service_role";

grant update on table "public"."achievement_requests_character" to "service_role";

grant delete on table "public"."achievement_requests_dm" to "anon";

grant insert on table "public"."achievement_requests_dm" to "anon";

grant references on table "public"."achievement_requests_dm" to "anon";

grant select on table "public"."achievement_requests_dm" to "anon";

grant trigger on table "public"."achievement_requests_dm" to "anon";

grant truncate on table "public"."achievement_requests_dm" to "anon";

grant update on table "public"."achievement_requests_dm" to "anon";

grant delete on table "public"."achievement_requests_dm" to "authenticated";

grant insert on table "public"."achievement_requests_dm" to "authenticated";

grant references on table "public"."achievement_requests_dm" to "authenticated";

grant select on table "public"."achievement_requests_dm" to "authenticated";

grant trigger on table "public"."achievement_requests_dm" to "authenticated";

grant truncate on table "public"."achievement_requests_dm" to "authenticated";

grant update on table "public"."achievement_requests_dm" to "authenticated";

grant delete on table "public"."achievement_requests_dm" to "service_role";

grant insert on table "public"."achievement_requests_dm" to "service_role";

grant references on table "public"."achievement_requests_dm" to "service_role";

grant select on table "public"."achievement_requests_dm" to "service_role";

grant trigger on table "public"."achievement_requests_dm" to "service_role";

grant truncate on table "public"."achievement_requests_dm" to "service_role";

grant update on table "public"."achievement_requests_dm" to "service_role";

grant delete on table "public"."achievement_requests_player" to "anon";

grant insert on table "public"."achievement_requests_player" to "anon";

grant references on table "public"."achievement_requests_player" to "anon";

grant select on table "public"."achievement_requests_player" to "anon";

grant trigger on table "public"."achievement_requests_player" to "anon";

grant truncate on table "public"."achievement_requests_player" to "anon";

grant update on table "public"."achievement_requests_player" to "anon";

grant delete on table "public"."achievement_requests_player" to "authenticated";

grant insert on table "public"."achievement_requests_player" to "authenticated";

grant references on table "public"."achievement_requests_player" to "authenticated";

grant select on table "public"."achievement_requests_player" to "authenticated";

grant trigger on table "public"."achievement_requests_player" to "authenticated";

grant truncate on table "public"."achievement_requests_player" to "authenticated";

grant update on table "public"."achievement_requests_player" to "authenticated";

grant delete on table "public"."achievement_requests_player" to "service_role";

grant insert on table "public"."achievement_requests_player" to "service_role";

grant references on table "public"."achievement_requests_player" to "service_role";

grant select on table "public"."achievement_requests_player" to "service_role";

grant trigger on table "public"."achievement_requests_player" to "service_role";

grant truncate on table "public"."achievement_requests_player" to "service_role";

grant update on table "public"."achievement_requests_player" to "service_role";

create policy "Enable ALL for admins"
on "public"."achievement_requests_character"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (( SELECT auth.uid() AS uid) = roles.auth_user_uuid))) = 'admin'::role));


create policy "Enable all for own character"
on "public"."achievement_requests_character"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM (characters c
     JOIN players p ON ((c.player_uuid = p.id)))
  WHERE ((c.id = achievement_requests_character.character_id) AND (p.auth_user_uuid = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM (characters c
     JOIN players p ON ((c.player_uuid = p.id)))
  WHERE ((c.id = achievement_requests_character.character_id) AND (p.auth_user_uuid = ( SELECT auth.uid() AS uid))))));



