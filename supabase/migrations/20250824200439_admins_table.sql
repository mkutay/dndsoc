
  create table "public"."admins" (
    "auth_user_uuid" uuid not null,
    "id" uuid not null default gen_random_uuid(),
    "about" text not null default ''::text,
    "image_uuid" uuid
      );


alter table "public"."admins" enable row level security;

CREATE UNIQUE INDEX admins_auth_user_uuid_key ON public.admins USING btree (auth_user_uuid);

CREATE UNIQUE INDEX admins_pkey ON public.admins USING btree (id);

alter table "public"."admins" add constraint "admins_pkey" PRIMARY KEY using index "admins_pkey";

alter table "public"."admins" add constraint "admins_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."admins" validate constraint "admins_auth_user_uuid_fkey";

alter table "public"."admins" add constraint "admins_auth_user_uuid_fkey1" FOREIGN KEY (auth_user_uuid) REFERENCES users(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."admins" validate constraint "admins_auth_user_uuid_fkey1";

alter table "public"."admins" add constraint "admins_auth_user_uuid_key" UNIQUE using index "admins_auth_user_uuid_key";

alter table "public"."admins" add constraint "admins_image_uuid_fkey" FOREIGN KEY (image_uuid) REFERENCES images(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."admins" validate constraint "admins_image_uuid_fkey";

alter table "public"."admins" add constraint "admins_image_uuid_fkey1" FOREIGN KEY (image_uuid) REFERENCES storage.objects(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."admins" validate constraint "admins_image_uuid_fkey1";

grant delete on table "public"."admins" to "anon";

grant insert on table "public"."admins" to "anon";

grant references on table "public"."admins" to "anon";

grant select on table "public"."admins" to "anon";

grant trigger on table "public"."admins" to "anon";

grant truncate on table "public"."admins" to "anon";

grant update on table "public"."admins" to "anon";

grant delete on table "public"."admins" to "authenticated";

grant insert on table "public"."admins" to "authenticated";

grant references on table "public"."admins" to "authenticated";

grant select on table "public"."admins" to "authenticated";

grant trigger on table "public"."admins" to "authenticated";

grant truncate on table "public"."admins" to "authenticated";

grant update on table "public"."admins" to "authenticated";

grant delete on table "public"."admins" to "service_role";

grant insert on table "public"."admins" to "service_role";

grant references on table "public"."admins" to "service_role";

grant select on table "public"."admins" to "service_role";

grant trigger on table "public"."admins" to "service_role";

grant truncate on table "public"."admins" to "service_role";

grant update on table "public"."admins" to "service_role";


  create policy "Enable read access for all users"
  on "public"."admins"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update based on auth"
  on "public"."admins"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = auth_user_uuid))
with check ((( SELECT auth.uid() AS uid) = auth_user_uuid));



