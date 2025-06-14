alter table "public"."dms" drop constraint "dms_auth_user_uuid_fkey";

alter table "public"."dms" drop constraint "dms_auth_user_uuid_fkey1";

alter table "public"."players" drop constraint "players_auth_user_uuid_fkey";

alter table "public"."players" drop constraint "players_auth_user_uuid_fkey1";

alter table "public"."players" drop constraint "players_auth_user_uuid_fkey2";

alter table "public"."roles" drop constraint "roles_auth_user_uuid_fkey";

alter table "public"."roles" drop constraint "roles_auth_user_uuid_fkey1";

alter table "public"."users" drop constraint "users_auth_user_uuid_fkey";

alter table "public"."votes" drop constraint "votes_auth_user_uuid_fkey";

alter table "public"."votes" drop constraint "votes_auth_user_uuid_fkey1";

alter table "public"."dms" alter column "auth_user_uuid" drop not null;

alter table "public"."players" alter column "auth_user_uuid" drop not null;

alter table "public"."votes" alter column "auth_user_uuid" drop not null;

alter table "public"."dms" add constraint "dms_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES users(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."dms" validate constraint "dms_auth_user_uuid_fkey";

alter table "public"."dms" add constraint "dms_auth_user_uuid_fkey1" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."dms" validate constraint "dms_auth_user_uuid_fkey1";

alter table "public"."players" add constraint "players_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."players" validate constraint "players_auth_user_uuid_fkey";

alter table "public"."players" add constraint "players_auth_user_uuid_fkey1" FOREIGN KEY (auth_user_uuid) REFERENCES users(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."players" validate constraint "players_auth_user_uuid_fkey1";

alter table "public"."players" add constraint "players_auth_user_uuid_fkey2" FOREIGN KEY (auth_user_uuid) REFERENCES roles(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."players" validate constraint "players_auth_user_uuid_fkey2";

alter table "public"."roles" add constraint "roles_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES users(auth_user_uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."roles" validate constraint "roles_auth_user_uuid_fkey";

alter table "public"."roles" add constraint "roles_auth_user_uuid_fkey1" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."roles" validate constraint "roles_auth_user_uuid_fkey1";

alter table "public"."users" add constraint "users_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_auth_user_uuid_fkey";

alter table "public"."votes" add constraint "votes_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."votes" validate constraint "votes_auth_user_uuid_fkey";

alter table "public"."votes" add constraint "votes_auth_user_uuid_fkey1" FOREIGN KEY (auth_user_uuid) REFERENCES users(auth_user_uuid) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."votes" validate constraint "votes_auth_user_uuid_fkey1";


