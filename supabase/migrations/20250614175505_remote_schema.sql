create type "public"."achievement_type" as enum ('dm', 'player', 'character');

create type "public"."difficulty" as enum ('easy', 'medium', 'hard', 'impossible');

create type "public"."role" as enum ('admin', 'dm', 'player');

create table "public"."achievements" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text not null,
    "shortened" text not null,
    "category" text,
    "difficulty" difficulty,
    "points" integer,
    "type" achievement_type not null,
    "is_hidden" boolean not null default false,
    "max_unlocks" integer not null default 1,
    "description_long" text
);


alter table "public"."achievements" enable row level security;

create table "public"."campaigns" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text not null default ''::text,
    "start_date" date not null default CURRENT_DATE,
    "end_date" date,
    "shortened" text not null default ''::text
);


alter table "public"."campaigns" enable row level security;

create table "public"."character_class" (
    "character_id" uuid not null default gen_random_uuid(),
    "class_id" uuid not null default gen_random_uuid()
);


alter table "public"."character_class" enable row level security;

create table "public"."character_party" (
    "party_id" uuid not null default gen_random_uuid(),
    "character_id" uuid not null default gen_random_uuid()
);


alter table "public"."character_party" enable row level security;

create table "public"."character_race" (
    "character_id" uuid not null default gen_random_uuid(),
    "race_id" uuid not null default gen_random_uuid()
);


alter table "public"."character_race" enable row level security;

create table "public"."characters" (
    "id" uuid not null default gen_random_uuid(),
    "player_uuid" uuid,
    "name" text not null default ''::text,
    "level" integer not null default 1,
    "shortened" text not null,
    "about" text not null default ''::text,
    "image_uuid" uuid
);


alter table "public"."characters" enable row level security;

create table "public"."classes" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "rules_url" text
);


alter table "public"."classes" enable row level security;

create table "public"."dm_party" (
    "party_id" uuid not null default gen_random_uuid(),
    "dm_id" uuid not null default gen_random_uuid()
);


alter table "public"."dm_party" enable row level security;

create table "public"."dms" (
    "auth_user_uuid" uuid not null,
    "level" integer not null default 1,
    "id" uuid not null default gen_random_uuid(),
    "about" text not null default ''::text,
    "image_uuid" uuid
);


alter table "public"."dms" enable row level security;

create table "public"."images" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null
);


alter table "public"."images" enable row level security;

create table "public"."journal" (
    "id" uuid not null default gen_random_uuid(),
    "date" date not null,
    "excerpt" text not null default ''::text,
    "campaign_id" uuid not null,
    "title" text not null default ''::text,
    "shortened" text not null default ''::text
);


alter table "public"."journal" enable row level security;

create table "public"."options" (
    "id" uuid not null default gen_random_uuid(),
    "poll_id" uuid not null default gen_random_uuid(),
    "text" text not null
);


alter table "public"."options" enable row level security;

create table "public"."parties" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null default ''::text,
    "shortened" text not null,
    "level" integer not null default 1,
    "about" text not null default ''::text,
    "image_uuid" uuid
);


alter table "public"."parties" enable row level security;

create table "public"."party_campaigns" (
    "party_id" uuid not null default gen_random_uuid(),
    "campaign_id" uuid not null default gen_random_uuid()
);


alter table "public"."party_campaigns" enable row level security;

create table "public"."party_entries" (
    "journal_id" uuid not null default gen_random_uuid(),
    "party_id" uuid not null default gen_random_uuid(),
    "text" text not null default ''::text
);


alter table "public"."party_entries" enable row level security;

create table "public"."players" (
    "auth_user_uuid" uuid not null,
    "level" integer not null default 1,
    "id" uuid not null default gen_random_uuid(),
    "about" text not null default ''::text,
    "image_uuid" uuid
);


alter table "public"."players" enable row level security;

create table "public"."polls" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "question" text not null,
    "expires_at" timestamp with time zone,
    "shortened" text not null
);


alter table "public"."polls" enable row level security;

create table "public"."races" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "rules_url" text
);


alter table "public"."races" enable row level security;

create table "public"."received_achievements_character" (
    "achievement_uuid" uuid not null,
    "character_uuid" uuid not null,
    "first_received_date" date not null,
    "last_received_date" date not null,
    "count" integer not null default 1
);


alter table "public"."received_achievements_character" enable row level security;

create table "public"."received_achievements_dm" (
    "achievement_uuid" uuid not null,
    "dm_uuid" uuid not null,
    "first_received_date" date not null,
    "last_received_date" date not null,
    "count" integer not null default 1
);


alter table "public"."received_achievements_dm" enable row level security;

create table "public"."received_achievements_player" (
    "achievement_uuid" uuid not null,
    "player_uuid" uuid not null,
    "first_received_date" date not null,
    "last_received_date" date not null,
    "count" integer not null default 1
);


alter table "public"."received_achievements_player" enable row level security;

create table "public"."roles" (
    "auth_user_uuid" uuid not null default gen_random_uuid(),
    "role" role not null
);


alter table "public"."roles" enable row level security;

create table "public"."users" (
    "auth_user_uuid" uuid not null default gen_random_uuid(),
    "knumber" text not null,
    "username" text not null,
    "name" text not null default ''::text
);


alter table "public"."users" enable row level security;

create table "public"."votes" (
    "option_id" uuid not null,
    "auth_user_uuid" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "poll_id" uuid not null,
    "id" uuid not null default gen_random_uuid()
);


alter table "public"."votes" enable row level security;

CREATE UNIQUE INDEX achievements_pkey ON public.achievements USING btree (id);

CREATE UNIQUE INDEX achievements_shortened_key ON public.achievements USING btree (shortened);

CREATE UNIQUE INDEX campaigns_pkey ON public.campaigns USING btree (id);

CREATE UNIQUE INDEX campaigns_shortened_key ON public.campaigns USING btree (shortened);

CREATE UNIQUE INDEX character_class_pkey ON public.character_class USING btree (character_id, class_id);

CREATE UNIQUE INDEX character_party_pkey ON public.character_party USING btree (party_id, character_id);

CREATE UNIQUE INDEX character_race_pkey ON public.character_race USING btree (character_id, race_id);

CREATE UNIQUE INDEX characters_pkey ON public.characters USING btree (id);

CREATE UNIQUE INDEX characters_shortened_key ON public.characters USING btree (shortened);

CREATE UNIQUE INDEX classes_name_key ON public.classes USING btree (name);

CREATE UNIQUE INDEX classes_pkey ON public.classes USING btree (id);

CREATE UNIQUE INDEX dm_party_pkey ON public.dm_party USING btree (party_id, dm_id);

CREATE UNIQUE INDEX dms_auth_user_uuid_key ON public.dms USING btree (auth_user_uuid);

CREATE UNIQUE INDEX dms_pkey ON public.dms USING btree (id);

CREATE UNIQUE INDEX images_pkey ON public.images USING btree (id);

CREATE UNIQUE INDEX journal_pkey ON public.journal USING btree (id);

CREATE UNIQUE INDEX journal_shortened_key ON public.journal USING btree (shortened);

CREATE UNIQUE INDEX options_pkey ON public.options USING btree (id);

CREATE UNIQUE INDEX party_campaigns_pkey ON public.party_campaigns USING btree (party_id, campaign_id);

CREATE UNIQUE INDEX party_entries_pkey ON public.party_entries USING btree (journal_id, party_id);

CREATE UNIQUE INDEX party_pkey ON public.parties USING btree (id);

CREATE UNIQUE INDEX party_shortened_key ON public.parties USING btree (shortened);

CREATE UNIQUE INDEX players_auth_user_uuid_key ON public.players USING btree (auth_user_uuid);

CREATE UNIQUE INDEX players_pkey ON public.players USING btree (id);

CREATE UNIQUE INDEX polls_pkey ON public.polls USING btree (id);

CREATE UNIQUE INDEX polls_shortened_key ON public.polls USING btree (shortened);

CREATE UNIQUE INDEX races_name_key ON public.races USING btree (name);

CREATE UNIQUE INDEX races_pkey ON public.races USING btree (id);

CREATE UNIQUE INDEX received_achievements_characters_pkey ON public.received_achievements_character USING btree (achievement_uuid, character_uuid);

CREATE UNIQUE INDEX received_achievements_dm_pkey ON public.received_achievements_dm USING btree (achievement_uuid, dm_uuid);

CREATE UNIQUE INDEX received_achievements_player_pkey ON public.received_achievements_player USING btree (achievement_uuid, player_uuid);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (auth_user_uuid);

CREATE UNIQUE INDEX users_knumber_key ON public.users USING btree (knumber);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (auth_user_uuid);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

CREATE UNIQUE INDEX votes_pkey ON public.votes USING btree (id);

alter table "public"."achievements" add constraint "achievements_pkey" PRIMARY KEY using index "achievements_pkey";

alter table "public"."campaigns" add constraint "campaigns_pkey" PRIMARY KEY using index "campaigns_pkey";

alter table "public"."character_class" add constraint "character_class_pkey" PRIMARY KEY using index "character_class_pkey";

alter table "public"."character_party" add constraint "character_party_pkey" PRIMARY KEY using index "character_party_pkey";

alter table "public"."character_race" add constraint "character_race_pkey" PRIMARY KEY using index "character_race_pkey";

alter table "public"."characters" add constraint "characters_pkey" PRIMARY KEY using index "characters_pkey";

alter table "public"."classes" add constraint "classes_pkey" PRIMARY KEY using index "classes_pkey";

alter table "public"."dm_party" add constraint "dm_party_pkey" PRIMARY KEY using index "dm_party_pkey";

alter table "public"."dms" add constraint "dms_pkey" PRIMARY KEY using index "dms_pkey";

alter table "public"."images" add constraint "images_pkey" PRIMARY KEY using index "images_pkey";

alter table "public"."journal" add constraint "journal_pkey" PRIMARY KEY using index "journal_pkey";

alter table "public"."options" add constraint "options_pkey" PRIMARY KEY using index "options_pkey";

alter table "public"."parties" add constraint "party_pkey" PRIMARY KEY using index "party_pkey";

alter table "public"."party_campaigns" add constraint "party_campaigns_pkey" PRIMARY KEY using index "party_campaigns_pkey";

alter table "public"."party_entries" add constraint "party_entries_pkey" PRIMARY KEY using index "party_entries_pkey";

alter table "public"."players" add constraint "players_pkey" PRIMARY KEY using index "players_pkey";

alter table "public"."polls" add constraint "polls_pkey" PRIMARY KEY using index "polls_pkey";

alter table "public"."races" add constraint "races_pkey" PRIMARY KEY using index "races_pkey";

alter table "public"."received_achievements_character" add constraint "received_achievements_characters_pkey" PRIMARY KEY using index "received_achievements_characters_pkey";

alter table "public"."received_achievements_dm" add constraint "received_achievements_dm_pkey" PRIMARY KEY using index "received_achievements_dm_pkey";

alter table "public"."received_achievements_player" add constraint "received_achievements_player_pkey" PRIMARY KEY using index "received_achievements_player_pkey";

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."votes" add constraint "votes_pkey" PRIMARY KEY using index "votes_pkey";

alter table "public"."achievements" add constraint "achievements_shortened_key" UNIQUE using index "achievements_shortened_key";

alter table "public"."campaigns" add constraint "campaigns_shortened_key" UNIQUE using index "campaigns_shortened_key";

alter table "public"."character_class" add constraint "character_class_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_class" validate constraint "character_class_character_id_fkey";

alter table "public"."character_class" add constraint "character_class_class_id_fkey" FOREIGN KEY (class_id) REFERENCES classes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."character_class" validate constraint "character_class_class_id_fkey";

alter table "public"."character_party" add constraint "character_party_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_party" validate constraint "character_party_character_id_fkey";

alter table "public"."character_party" add constraint "character_party_party_id_fkey" FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE not valid;

alter table "public"."character_party" validate constraint "character_party_party_id_fkey";

alter table "public"."character_race" add constraint "character_race_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE not valid;

alter table "public"."character_race" validate constraint "character_race_character_id_fkey";

alter table "public"."character_race" add constraint "character_race_race_id_fkey" FOREIGN KEY (race_id) REFERENCES races(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."character_race" validate constraint "character_race_race_id_fkey";

alter table "public"."characters" add constraint "characters_image_uuid_fkey" FOREIGN KEY (image_uuid) REFERENCES storage.objects(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."characters" validate constraint "characters_image_uuid_fkey";

alter table "public"."characters" add constraint "characters_image_uuid_fkey1" FOREIGN KEY (image_uuid) REFERENCES images(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."characters" validate constraint "characters_image_uuid_fkey1";

alter table "public"."characters" add constraint "characters_player_uuid_fkey" FOREIGN KEY (player_uuid) REFERENCES players(id) ON DELETE SET NULL not valid;

alter table "public"."characters" validate constraint "characters_player_uuid_fkey";

alter table "public"."characters" add constraint "characters_shortened_key" UNIQUE using index "characters_shortened_key";

alter table "public"."classes" add constraint "classes_name_key" UNIQUE using index "classes_name_key";

alter table "public"."dm_party" add constraint "dm_party_dm_id_fkey" FOREIGN KEY (dm_id) REFERENCES dms(id) ON DELETE CASCADE not valid;

alter table "public"."dm_party" validate constraint "dm_party_dm_id_fkey";

alter table "public"."dm_party" add constraint "dm_party_party_id_fkey" FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE not valid;

alter table "public"."dm_party" validate constraint "dm_party_party_id_fkey";

alter table "public"."dms" add constraint "dms_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."dms" validate constraint "dms_auth_user_uuid_fkey";

alter table "public"."dms" add constraint "dms_auth_user_uuid_fkey1" FOREIGN KEY (auth_user_uuid) REFERENCES users(auth_user_uuid) ON DELETE SET NULL not valid;

alter table "public"."dms" validate constraint "dms_auth_user_uuid_fkey1";

alter table "public"."dms" add constraint "dms_auth_user_uuid_key" UNIQUE using index "dms_auth_user_uuid_key";

alter table "public"."dms" add constraint "dms_image_uuid_fkey" FOREIGN KEY (image_uuid) REFERENCES storage.objects(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."dms" validate constraint "dms_image_uuid_fkey";

alter table "public"."dms" add constraint "dms_image_uuid_fkey1" FOREIGN KEY (image_uuid) REFERENCES images(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."dms" validate constraint "dms_image_uuid_fkey1";

alter table "public"."images" add constraint "images_id_fkey" FOREIGN KEY (id) REFERENCES storage.objects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."images" validate constraint "images_id_fkey";

alter table "public"."journal" add constraint "journal_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."journal" validate constraint "journal_campaign_id_fkey";

alter table "public"."journal" add constraint "journal_shortened_key" UNIQUE using index "journal_shortened_key";

alter table "public"."options" add constraint "options_poll_id_fkey" FOREIGN KEY (poll_id) REFERENCES polls(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."options" validate constraint "options_poll_id_fkey";

alter table "public"."parties" add constraint "parties_image_uuid_fkey" FOREIGN KEY (image_uuid) REFERENCES storage.objects(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."parties" validate constraint "parties_image_uuid_fkey";

alter table "public"."parties" add constraint "parties_image_uuid_fkey1" FOREIGN KEY (image_uuid) REFERENCES images(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."parties" validate constraint "parties_image_uuid_fkey1";

alter table "public"."parties" add constraint "party_shortened_key" UNIQUE using index "party_shortened_key";

alter table "public"."party_campaigns" add constraint "party_campaigns_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE not valid;

alter table "public"."party_campaigns" validate constraint "party_campaigns_campaign_id_fkey";

alter table "public"."party_campaigns" add constraint "party_campaigns_party_id_fkey" FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE not valid;

alter table "public"."party_campaigns" validate constraint "party_campaigns_party_id_fkey";

alter table "public"."party_entries" add constraint "party_entries_journal_id_fkey" FOREIGN KEY (journal_id) REFERENCES journal(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."party_entries" validate constraint "party_entries_journal_id_fkey";

alter table "public"."party_entries" add constraint "party_entries_party_id_fkey" FOREIGN KEY (party_id) REFERENCES parties(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."party_entries" validate constraint "party_entries_party_id_fkey";

alter table "public"."players" add constraint "players_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."players" validate constraint "players_auth_user_uuid_fkey";

alter table "public"."players" add constraint "players_auth_user_uuid_fkey1" FOREIGN KEY (auth_user_uuid) REFERENCES users(auth_user_uuid) ON DELETE CASCADE not valid;

alter table "public"."players" validate constraint "players_auth_user_uuid_fkey1";

alter table "public"."players" add constraint "players_auth_user_uuid_fkey2" FOREIGN KEY (auth_user_uuid) REFERENCES roles(auth_user_uuid) ON DELETE CASCADE not valid;

alter table "public"."players" validate constraint "players_auth_user_uuid_fkey2";

alter table "public"."players" add constraint "players_auth_user_uuid_key" UNIQUE using index "players_auth_user_uuid_key";

alter table "public"."players" add constraint "players_image_uuid_fkey" FOREIGN KEY (image_uuid) REFERENCES storage.objects(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."players" validate constraint "players_image_uuid_fkey";

alter table "public"."players" add constraint "players_image_uuid_fkey1" FOREIGN KEY (image_uuid) REFERENCES images(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."players" validate constraint "players_image_uuid_fkey1";

alter table "public"."polls" add constraint "polls_shortened_key" UNIQUE using index "polls_shortened_key";

alter table "public"."races" add constraint "races_name_key" UNIQUE using index "races_name_key";

alter table "public"."received_achievements_character" add constraint "received_achievements_characters_achievement_uuid_fkey" FOREIGN KEY (achievement_uuid) REFERENCES achievements(id) not valid;

alter table "public"."received_achievements_character" validate constraint "received_achievements_characters_achievement_uuid_fkey";

alter table "public"."received_achievements_character" add constraint "received_achievements_characters_character_uuid_fkey" FOREIGN KEY (character_uuid) REFERENCES characters(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."received_achievements_character" validate constraint "received_achievements_characters_character_uuid_fkey";

alter table "public"."received_achievements_dm" add constraint "received_achievements_dm_achievement_uuid_fkey" FOREIGN KEY (achievement_uuid) REFERENCES achievements(id) not valid;

alter table "public"."received_achievements_dm" validate constraint "received_achievements_dm_achievement_uuid_fkey";

alter table "public"."received_achievements_dm" add constraint "received_achievements_dm_dm_uuid_fkey" FOREIGN KEY (dm_uuid) REFERENCES dms(id) ON DELETE CASCADE not valid;

alter table "public"."received_achievements_dm" validate constraint "received_achievements_dm_dm_uuid_fkey";

alter table "public"."received_achievements_player" add constraint "received_achievements_achievement_uuid_fkey" FOREIGN KEY (achievement_uuid) REFERENCES achievements(id) not valid;

alter table "public"."received_achievements_player" validate constraint "received_achievements_achievement_uuid_fkey";

alter table "public"."received_achievements_player" add constraint "received_achievements_player_uuid_fkey" FOREIGN KEY (player_uuid) REFERENCES players(id) ON DELETE CASCADE not valid;

alter table "public"."received_achievements_player" validate constraint "received_achievements_player_uuid_fkey";

alter table "public"."roles" add constraint "roles_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."roles" validate constraint "roles_auth_user_uuid_fkey";

alter table "public"."roles" add constraint "roles_auth_user_uuid_fkey1" FOREIGN KEY (auth_user_uuid) REFERENCES users(auth_user_uuid) ON DELETE CASCADE not valid;

alter table "public"."roles" validate constraint "roles_auth_user_uuid_fkey1";

alter table "public"."users" add constraint "users_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_auth_user_uuid_fkey";

alter table "public"."users" add constraint "users_knumber_key" UNIQUE using index "users_knumber_key";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

alter table "public"."votes" add constraint "votes_auth_user_uuid_fkey" FOREIGN KEY (auth_user_uuid) REFERENCES users(auth_user_uuid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."votes" validate constraint "votes_auth_user_uuid_fkey";

alter table "public"."votes" add constraint "votes_auth_user_uuid_fkey1" FOREIGN KEY (auth_user_uuid) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."votes" validate constraint "votes_auth_user_uuid_fkey1";

alter table "public"."votes" add constraint "votes_option_id_fkey" FOREIGN KEY (option_id) REFERENCES options(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."votes" validate constraint "votes_option_id_fkey";

alter table "public"."votes" add constraint "votes_poll_id_fkey" FOREIGN KEY (poll_id) REFERENCES polls(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."votes" validate constraint "votes_poll_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.copy_object_images()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Only insert if it's a profile image
        IF NEW.bucket_id = 'profile-images' THEN
            INSERT INTO public.images (id, name)
            VALUES (NEW.id, NEW.name)
            ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
        END IF;
        RETURN NEW;
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle bucket changes
        IF OLD.bucket_id = 'profile-images' AND NEW.bucket_id != 'profile-images' THEN
            -- Moved out of profile-images bucket
            DELETE FROM public.images WHERE id = OLD.id;
        ELSIF OLD.bucket_id != 'profile-images' AND NEW.bucket_id = 'profile-images' THEN
            -- Moved into profile-images bucket
            INSERT INTO public.images (id, name)
            VALUES (NEW.id, NEW.name)
            ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
        ELSIF NEW.bucket_id = 'profile-images' THEN
            -- Updated within profile-images bucket
            UPDATE public.images 
            SET name = NEW.name 
            WHERE id = NEW.id;
        END IF;
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        -- Only delete if it was a profile image
        IF OLD.bucket_id = 'profile-images' THEN
            DELETE FROM public.images WHERE id = OLD.id;
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_party_entries_for_campaign(a_campaign_id uuid, a_journal_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  INSERT INTO party_entries (journal_id, party_id, text)
  SELECT
    a_journal_id, -- The journal_id from the function argument
    pc.party_id,  -- The party_id from the party_campaigns table
    ''            -- The specified empty string for the text field
  FROM
    party_campaigns AS pc
  WHERE
    pc.campaign_id = a_campaign_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.is_dm_for_player(player_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
SELECT EXISTS (
  SELECT 1 FROM dms
  JOIN dm_party ON dm_party.dm_id = dms.id
  JOIN character_party ON character_party.party_id = dm_party.party_id
  JOIN characters ON characters.id = character_party.character_id
  WHERE characters.player_uuid = player_id
  AND dms.auth_user_uuid = auth.uid()
);
END;$function$
;

CREATE OR REPLACE FUNCTION public.vote_on(a_option_id uuid, a_poll_id uuid, a_auth_user_uuid uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
IF EXISTS (
  SELECT 1
  FROM votes
  WHERE
    option_id = a_option_id
    AND auth_user_uuid = a_auth_user_uuid
    AND poll_id = a_poll_id
) THEN
  DELETE FROM votes
    WHERE
      option_id = a_option_id
      AND auth_user_uuid = a_auth_user_uuid
      AND poll_id = a_poll_id;
ELSE
  DELETE FROM votes
    WHERE
      auth_user_uuid = a_auth_user_uuid
      AND poll_id = a_poll_id;

  INSERT INTO
    votes (poll_id, option_id, auth_user_uuid)
  VALUES
    (a_poll_id, a_option_id, a_auth_user_uuid);
END IF;
END;$function$
;

grant delete on table "public"."achievements" to "anon";

grant insert on table "public"."achievements" to "anon";

grant references on table "public"."achievements" to "anon";

grant select on table "public"."achievements" to "anon";

grant trigger on table "public"."achievements" to "anon";

grant truncate on table "public"."achievements" to "anon";

grant update on table "public"."achievements" to "anon";

grant delete on table "public"."achievements" to "authenticated";

grant insert on table "public"."achievements" to "authenticated";

grant references on table "public"."achievements" to "authenticated";

grant select on table "public"."achievements" to "authenticated";

grant trigger on table "public"."achievements" to "authenticated";

grant truncate on table "public"."achievements" to "authenticated";

grant update on table "public"."achievements" to "authenticated";

grant delete on table "public"."achievements" to "postgres";

grant insert on table "public"."achievements" to "postgres";

grant references on table "public"."achievements" to "postgres";

grant select on table "public"."achievements" to "postgres";

grant trigger on table "public"."achievements" to "postgres";

grant truncate on table "public"."achievements" to "postgres";

grant update on table "public"."achievements" to "postgres";

grant delete on table "public"."achievements" to "service_role";

grant insert on table "public"."achievements" to "service_role";

grant references on table "public"."achievements" to "service_role";

grant select on table "public"."achievements" to "service_role";

grant trigger on table "public"."achievements" to "service_role";

grant truncate on table "public"."achievements" to "service_role";

grant update on table "public"."achievements" to "service_role";

grant delete on table "public"."campaigns" to "anon";

grant insert on table "public"."campaigns" to "anon";

grant references on table "public"."campaigns" to "anon";

grant select on table "public"."campaigns" to "anon";

grant trigger on table "public"."campaigns" to "anon";

grant truncate on table "public"."campaigns" to "anon";

grant update on table "public"."campaigns" to "anon";

grant delete on table "public"."campaigns" to "authenticated";

grant insert on table "public"."campaigns" to "authenticated";

grant references on table "public"."campaigns" to "authenticated";

grant select on table "public"."campaigns" to "authenticated";

grant trigger on table "public"."campaigns" to "authenticated";

grant truncate on table "public"."campaigns" to "authenticated";

grant update on table "public"."campaigns" to "authenticated";

grant delete on table "public"."campaigns" to "postgres";

grant insert on table "public"."campaigns" to "postgres";

grant references on table "public"."campaigns" to "postgres";

grant select on table "public"."campaigns" to "postgres";

grant trigger on table "public"."campaigns" to "postgres";

grant truncate on table "public"."campaigns" to "postgres";

grant update on table "public"."campaigns" to "postgres";

grant delete on table "public"."campaigns" to "service_role";

grant insert on table "public"."campaigns" to "service_role";

grant references on table "public"."campaigns" to "service_role";

grant select on table "public"."campaigns" to "service_role";

grant trigger on table "public"."campaigns" to "service_role";

grant truncate on table "public"."campaigns" to "service_role";

grant update on table "public"."campaigns" to "service_role";

grant delete on table "public"."character_class" to "anon";

grant insert on table "public"."character_class" to "anon";

grant references on table "public"."character_class" to "anon";

grant select on table "public"."character_class" to "anon";

grant trigger on table "public"."character_class" to "anon";

grant truncate on table "public"."character_class" to "anon";

grant update on table "public"."character_class" to "anon";

grant delete on table "public"."character_class" to "authenticated";

grant insert on table "public"."character_class" to "authenticated";

grant references on table "public"."character_class" to "authenticated";

grant select on table "public"."character_class" to "authenticated";

grant trigger on table "public"."character_class" to "authenticated";

grant truncate on table "public"."character_class" to "authenticated";

grant update on table "public"."character_class" to "authenticated";

grant delete on table "public"."character_class" to "postgres";

grant insert on table "public"."character_class" to "postgres";

grant references on table "public"."character_class" to "postgres";

grant select on table "public"."character_class" to "postgres";

grant trigger on table "public"."character_class" to "postgres";

grant truncate on table "public"."character_class" to "postgres";

grant update on table "public"."character_class" to "postgres";

grant delete on table "public"."character_class" to "service_role";

grant insert on table "public"."character_class" to "service_role";

grant references on table "public"."character_class" to "service_role";

grant select on table "public"."character_class" to "service_role";

grant trigger on table "public"."character_class" to "service_role";

grant truncate on table "public"."character_class" to "service_role";

grant update on table "public"."character_class" to "service_role";

grant delete on table "public"."character_party" to "anon";

grant insert on table "public"."character_party" to "anon";

grant references on table "public"."character_party" to "anon";

grant select on table "public"."character_party" to "anon";

grant trigger on table "public"."character_party" to "anon";

grant truncate on table "public"."character_party" to "anon";

grant update on table "public"."character_party" to "anon";

grant delete on table "public"."character_party" to "authenticated";

grant insert on table "public"."character_party" to "authenticated";

grant references on table "public"."character_party" to "authenticated";

grant select on table "public"."character_party" to "authenticated";

grant trigger on table "public"."character_party" to "authenticated";

grant truncate on table "public"."character_party" to "authenticated";

grant update on table "public"."character_party" to "authenticated";

grant delete on table "public"."character_party" to "postgres";

grant insert on table "public"."character_party" to "postgres";

grant references on table "public"."character_party" to "postgres";

grant select on table "public"."character_party" to "postgres";

grant trigger on table "public"."character_party" to "postgres";

grant truncate on table "public"."character_party" to "postgres";

grant update on table "public"."character_party" to "postgres";

grant delete on table "public"."character_party" to "service_role";

grant insert on table "public"."character_party" to "service_role";

grant references on table "public"."character_party" to "service_role";

grant select on table "public"."character_party" to "service_role";

grant trigger on table "public"."character_party" to "service_role";

grant truncate on table "public"."character_party" to "service_role";

grant update on table "public"."character_party" to "service_role";

grant delete on table "public"."character_race" to "anon";

grant insert on table "public"."character_race" to "anon";

grant references on table "public"."character_race" to "anon";

grant select on table "public"."character_race" to "anon";

grant trigger on table "public"."character_race" to "anon";

grant truncate on table "public"."character_race" to "anon";

grant update on table "public"."character_race" to "anon";

grant delete on table "public"."character_race" to "authenticated";

grant insert on table "public"."character_race" to "authenticated";

grant references on table "public"."character_race" to "authenticated";

grant select on table "public"."character_race" to "authenticated";

grant trigger on table "public"."character_race" to "authenticated";

grant truncate on table "public"."character_race" to "authenticated";

grant update on table "public"."character_race" to "authenticated";

grant delete on table "public"."character_race" to "postgres";

grant insert on table "public"."character_race" to "postgres";

grant references on table "public"."character_race" to "postgres";

grant select on table "public"."character_race" to "postgres";

grant trigger on table "public"."character_race" to "postgres";

grant truncate on table "public"."character_race" to "postgres";

grant update on table "public"."character_race" to "postgres";

grant delete on table "public"."character_race" to "service_role";

grant insert on table "public"."character_race" to "service_role";

grant references on table "public"."character_race" to "service_role";

grant select on table "public"."character_race" to "service_role";

grant trigger on table "public"."character_race" to "service_role";

grant truncate on table "public"."character_race" to "service_role";

grant update on table "public"."character_race" to "service_role";

grant delete on table "public"."characters" to "anon";

grant insert on table "public"."characters" to "anon";

grant references on table "public"."characters" to "anon";

grant select on table "public"."characters" to "anon";

grant trigger on table "public"."characters" to "anon";

grant truncate on table "public"."characters" to "anon";

grant update on table "public"."characters" to "anon";

grant delete on table "public"."characters" to "authenticated";

grant insert on table "public"."characters" to "authenticated";

grant references on table "public"."characters" to "authenticated";

grant select on table "public"."characters" to "authenticated";

grant trigger on table "public"."characters" to "authenticated";

grant truncate on table "public"."characters" to "authenticated";

grant update on table "public"."characters" to "authenticated";

grant delete on table "public"."characters" to "postgres";

grant insert on table "public"."characters" to "postgres";

grant references on table "public"."characters" to "postgres";

grant select on table "public"."characters" to "postgres";

grant trigger on table "public"."characters" to "postgres";

grant truncate on table "public"."characters" to "postgres";

grant update on table "public"."characters" to "postgres";

grant delete on table "public"."characters" to "service_role";

grant insert on table "public"."characters" to "service_role";

grant references on table "public"."characters" to "service_role";

grant select on table "public"."characters" to "service_role";

grant trigger on table "public"."characters" to "service_role";

grant truncate on table "public"."characters" to "service_role";

grant update on table "public"."characters" to "service_role";

grant delete on table "public"."classes" to "anon";

grant insert on table "public"."classes" to "anon";

grant references on table "public"."classes" to "anon";

grant select on table "public"."classes" to "anon";

grant trigger on table "public"."classes" to "anon";

grant truncate on table "public"."classes" to "anon";

grant update on table "public"."classes" to "anon";

grant delete on table "public"."classes" to "authenticated";

grant insert on table "public"."classes" to "authenticated";

grant references on table "public"."classes" to "authenticated";

grant select on table "public"."classes" to "authenticated";

grant trigger on table "public"."classes" to "authenticated";

grant truncate on table "public"."classes" to "authenticated";

grant update on table "public"."classes" to "authenticated";

grant delete on table "public"."classes" to "postgres";

grant insert on table "public"."classes" to "postgres";

grant references on table "public"."classes" to "postgres";

grant select on table "public"."classes" to "postgres";

grant trigger on table "public"."classes" to "postgres";

grant truncate on table "public"."classes" to "postgres";

grant update on table "public"."classes" to "postgres";

grant delete on table "public"."classes" to "service_role";

grant insert on table "public"."classes" to "service_role";

grant references on table "public"."classes" to "service_role";

grant select on table "public"."classes" to "service_role";

grant trigger on table "public"."classes" to "service_role";

grant truncate on table "public"."classes" to "service_role";

grant update on table "public"."classes" to "service_role";

grant delete on table "public"."dm_party" to "anon";

grant insert on table "public"."dm_party" to "anon";

grant references on table "public"."dm_party" to "anon";

grant select on table "public"."dm_party" to "anon";

grant trigger on table "public"."dm_party" to "anon";

grant truncate on table "public"."dm_party" to "anon";

grant update on table "public"."dm_party" to "anon";

grant delete on table "public"."dm_party" to "authenticated";

grant insert on table "public"."dm_party" to "authenticated";

grant references on table "public"."dm_party" to "authenticated";

grant select on table "public"."dm_party" to "authenticated";

grant trigger on table "public"."dm_party" to "authenticated";

grant truncate on table "public"."dm_party" to "authenticated";

grant update on table "public"."dm_party" to "authenticated";

grant delete on table "public"."dm_party" to "postgres";

grant insert on table "public"."dm_party" to "postgres";

grant references on table "public"."dm_party" to "postgres";

grant select on table "public"."dm_party" to "postgres";

grant trigger on table "public"."dm_party" to "postgres";

grant truncate on table "public"."dm_party" to "postgres";

grant update on table "public"."dm_party" to "postgres";

grant delete on table "public"."dm_party" to "service_role";

grant insert on table "public"."dm_party" to "service_role";

grant references on table "public"."dm_party" to "service_role";

grant select on table "public"."dm_party" to "service_role";

grant trigger on table "public"."dm_party" to "service_role";

grant truncate on table "public"."dm_party" to "service_role";

grant update on table "public"."dm_party" to "service_role";

grant delete on table "public"."dms" to "anon";

grant insert on table "public"."dms" to "anon";

grant references on table "public"."dms" to "anon";

grant select on table "public"."dms" to "anon";

grant trigger on table "public"."dms" to "anon";

grant truncate on table "public"."dms" to "anon";

grant update on table "public"."dms" to "anon";

grant delete on table "public"."dms" to "authenticated";

grant insert on table "public"."dms" to "authenticated";

grant references on table "public"."dms" to "authenticated";

grant select on table "public"."dms" to "authenticated";

grant trigger on table "public"."dms" to "authenticated";

grant truncate on table "public"."dms" to "authenticated";

grant update on table "public"."dms" to "authenticated";

grant delete on table "public"."dms" to "postgres";

grant insert on table "public"."dms" to "postgres";

grant references on table "public"."dms" to "postgres";

grant select on table "public"."dms" to "postgres";

grant trigger on table "public"."dms" to "postgres";

grant truncate on table "public"."dms" to "postgres";

grant update on table "public"."dms" to "postgres";

grant delete on table "public"."dms" to "service_role";

grant insert on table "public"."dms" to "service_role";

grant references on table "public"."dms" to "service_role";

grant select on table "public"."dms" to "service_role";

grant trigger on table "public"."dms" to "service_role";

grant truncate on table "public"."dms" to "service_role";

grant update on table "public"."dms" to "service_role";

grant delete on table "public"."images" to "anon";

grant insert on table "public"."images" to "anon";

grant references on table "public"."images" to "anon";

grant select on table "public"."images" to "anon";

grant trigger on table "public"."images" to "anon";

grant truncate on table "public"."images" to "anon";

grant update on table "public"."images" to "anon";

grant delete on table "public"."images" to "authenticated";

grant insert on table "public"."images" to "authenticated";

grant references on table "public"."images" to "authenticated";

grant select on table "public"."images" to "authenticated";

grant trigger on table "public"."images" to "authenticated";

grant truncate on table "public"."images" to "authenticated";

grant update on table "public"."images" to "authenticated";

grant delete on table "public"."images" to "postgres";

grant insert on table "public"."images" to "postgres";

grant references on table "public"."images" to "postgres";

grant select on table "public"."images" to "postgres";

grant trigger on table "public"."images" to "postgres";

grant truncate on table "public"."images" to "postgres";

grant update on table "public"."images" to "postgres";

grant delete on table "public"."images" to "service_role";

grant insert on table "public"."images" to "service_role";

grant references on table "public"."images" to "service_role";

grant select on table "public"."images" to "service_role";

grant trigger on table "public"."images" to "service_role";

grant truncate on table "public"."images" to "service_role";

grant update on table "public"."images" to "service_role";

grant delete on table "public"."journal" to "anon";

grant insert on table "public"."journal" to "anon";

grant references on table "public"."journal" to "anon";

grant select on table "public"."journal" to "anon";

grant trigger on table "public"."journal" to "anon";

grant truncate on table "public"."journal" to "anon";

grant update on table "public"."journal" to "anon";

grant delete on table "public"."journal" to "authenticated";

grant insert on table "public"."journal" to "authenticated";

grant references on table "public"."journal" to "authenticated";

grant select on table "public"."journal" to "authenticated";

grant trigger on table "public"."journal" to "authenticated";

grant truncate on table "public"."journal" to "authenticated";

grant update on table "public"."journal" to "authenticated";

grant delete on table "public"."journal" to "postgres";

grant insert on table "public"."journal" to "postgres";

grant references on table "public"."journal" to "postgres";

grant select on table "public"."journal" to "postgres";

grant trigger on table "public"."journal" to "postgres";

grant truncate on table "public"."journal" to "postgres";

grant update on table "public"."journal" to "postgres";

grant delete on table "public"."journal" to "service_role";

grant insert on table "public"."journal" to "service_role";

grant references on table "public"."journal" to "service_role";

grant select on table "public"."journal" to "service_role";

grant trigger on table "public"."journal" to "service_role";

grant truncate on table "public"."journal" to "service_role";

grant update on table "public"."journal" to "service_role";

grant delete on table "public"."options" to "anon";

grant insert on table "public"."options" to "anon";

grant references on table "public"."options" to "anon";

grant select on table "public"."options" to "anon";

grant trigger on table "public"."options" to "anon";

grant truncate on table "public"."options" to "anon";

grant update on table "public"."options" to "anon";

grant delete on table "public"."options" to "authenticated";

grant insert on table "public"."options" to "authenticated";

grant references on table "public"."options" to "authenticated";

grant select on table "public"."options" to "authenticated";

grant trigger on table "public"."options" to "authenticated";

grant truncate on table "public"."options" to "authenticated";

grant update on table "public"."options" to "authenticated";

grant delete on table "public"."options" to "postgres";

grant insert on table "public"."options" to "postgres";

grant references on table "public"."options" to "postgres";

grant select on table "public"."options" to "postgres";

grant trigger on table "public"."options" to "postgres";

grant truncate on table "public"."options" to "postgres";

grant update on table "public"."options" to "postgres";

grant delete on table "public"."options" to "service_role";

grant insert on table "public"."options" to "service_role";

grant references on table "public"."options" to "service_role";

grant select on table "public"."options" to "service_role";

grant trigger on table "public"."options" to "service_role";

grant truncate on table "public"."options" to "service_role";

grant update on table "public"."options" to "service_role";

grant delete on table "public"."parties" to "anon";

grant insert on table "public"."parties" to "anon";

grant references on table "public"."parties" to "anon";

grant select on table "public"."parties" to "anon";

grant trigger on table "public"."parties" to "anon";

grant truncate on table "public"."parties" to "anon";

grant update on table "public"."parties" to "anon";

grant delete on table "public"."parties" to "authenticated";

grant insert on table "public"."parties" to "authenticated";

grant references on table "public"."parties" to "authenticated";

grant select on table "public"."parties" to "authenticated";

grant trigger on table "public"."parties" to "authenticated";

grant truncate on table "public"."parties" to "authenticated";

grant update on table "public"."parties" to "authenticated";

grant delete on table "public"."parties" to "postgres";

grant insert on table "public"."parties" to "postgres";

grant references on table "public"."parties" to "postgres";

grant select on table "public"."parties" to "postgres";

grant trigger on table "public"."parties" to "postgres";

grant truncate on table "public"."parties" to "postgres";

grant update on table "public"."parties" to "postgres";

grant delete on table "public"."parties" to "service_role";

grant insert on table "public"."parties" to "service_role";

grant references on table "public"."parties" to "service_role";

grant select on table "public"."parties" to "service_role";

grant trigger on table "public"."parties" to "service_role";

grant truncate on table "public"."parties" to "service_role";

grant update on table "public"."parties" to "service_role";

grant delete on table "public"."party_campaigns" to "anon";

grant insert on table "public"."party_campaigns" to "anon";

grant references on table "public"."party_campaigns" to "anon";

grant select on table "public"."party_campaigns" to "anon";

grant trigger on table "public"."party_campaigns" to "anon";

grant truncate on table "public"."party_campaigns" to "anon";

grant update on table "public"."party_campaigns" to "anon";

grant delete on table "public"."party_campaigns" to "authenticated";

grant insert on table "public"."party_campaigns" to "authenticated";

grant references on table "public"."party_campaigns" to "authenticated";

grant select on table "public"."party_campaigns" to "authenticated";

grant trigger on table "public"."party_campaigns" to "authenticated";

grant truncate on table "public"."party_campaigns" to "authenticated";

grant update on table "public"."party_campaigns" to "authenticated";

grant delete on table "public"."party_campaigns" to "postgres";

grant insert on table "public"."party_campaigns" to "postgres";

grant references on table "public"."party_campaigns" to "postgres";

grant select on table "public"."party_campaigns" to "postgres";

grant trigger on table "public"."party_campaigns" to "postgres";

grant truncate on table "public"."party_campaigns" to "postgres";

grant update on table "public"."party_campaigns" to "postgres";

grant delete on table "public"."party_campaigns" to "service_role";

grant insert on table "public"."party_campaigns" to "service_role";

grant references on table "public"."party_campaigns" to "service_role";

grant select on table "public"."party_campaigns" to "service_role";

grant trigger on table "public"."party_campaigns" to "service_role";

grant truncate on table "public"."party_campaigns" to "service_role";

grant update on table "public"."party_campaigns" to "service_role";

grant delete on table "public"."party_entries" to "anon";

grant insert on table "public"."party_entries" to "anon";

grant references on table "public"."party_entries" to "anon";

grant select on table "public"."party_entries" to "anon";

grant trigger on table "public"."party_entries" to "anon";

grant truncate on table "public"."party_entries" to "anon";

grant update on table "public"."party_entries" to "anon";

grant delete on table "public"."party_entries" to "authenticated";

grant insert on table "public"."party_entries" to "authenticated";

grant references on table "public"."party_entries" to "authenticated";

grant select on table "public"."party_entries" to "authenticated";

grant trigger on table "public"."party_entries" to "authenticated";

grant truncate on table "public"."party_entries" to "authenticated";

grant update on table "public"."party_entries" to "authenticated";

grant delete on table "public"."party_entries" to "postgres";

grant insert on table "public"."party_entries" to "postgres";

grant references on table "public"."party_entries" to "postgres";

grant select on table "public"."party_entries" to "postgres";

grant trigger on table "public"."party_entries" to "postgres";

grant truncate on table "public"."party_entries" to "postgres";

grant update on table "public"."party_entries" to "postgres";

grant delete on table "public"."party_entries" to "service_role";

grant insert on table "public"."party_entries" to "service_role";

grant references on table "public"."party_entries" to "service_role";

grant select on table "public"."party_entries" to "service_role";

grant trigger on table "public"."party_entries" to "service_role";

grant truncate on table "public"."party_entries" to "service_role";

grant update on table "public"."party_entries" to "service_role";

grant delete on table "public"."players" to "anon";

grant insert on table "public"."players" to "anon";

grant references on table "public"."players" to "anon";

grant select on table "public"."players" to "anon";

grant trigger on table "public"."players" to "anon";

grant truncate on table "public"."players" to "anon";

grant update on table "public"."players" to "anon";

grant delete on table "public"."players" to "authenticated";

grant insert on table "public"."players" to "authenticated";

grant references on table "public"."players" to "authenticated";

grant select on table "public"."players" to "authenticated";

grant trigger on table "public"."players" to "authenticated";

grant truncate on table "public"."players" to "authenticated";

grant update on table "public"."players" to "authenticated";

grant delete on table "public"."players" to "postgres";

grant insert on table "public"."players" to "postgres";

grant references on table "public"."players" to "postgres";

grant select on table "public"."players" to "postgres";

grant trigger on table "public"."players" to "postgres";

grant truncate on table "public"."players" to "postgres";

grant update on table "public"."players" to "postgres";

grant delete on table "public"."players" to "service_role";

grant insert on table "public"."players" to "service_role";

grant references on table "public"."players" to "service_role";

grant select on table "public"."players" to "service_role";

grant trigger on table "public"."players" to "service_role";

grant truncate on table "public"."players" to "service_role";

grant update on table "public"."players" to "service_role";

grant delete on table "public"."polls" to "anon";

grant insert on table "public"."polls" to "anon";

grant references on table "public"."polls" to "anon";

grant select on table "public"."polls" to "anon";

grant trigger on table "public"."polls" to "anon";

grant truncate on table "public"."polls" to "anon";

grant update on table "public"."polls" to "anon";

grant delete on table "public"."polls" to "authenticated";

grant insert on table "public"."polls" to "authenticated";

grant references on table "public"."polls" to "authenticated";

grant select on table "public"."polls" to "authenticated";

grant trigger on table "public"."polls" to "authenticated";

grant truncate on table "public"."polls" to "authenticated";

grant update on table "public"."polls" to "authenticated";

grant delete on table "public"."polls" to "postgres";

grant insert on table "public"."polls" to "postgres";

grant references on table "public"."polls" to "postgres";

grant select on table "public"."polls" to "postgres";

grant trigger on table "public"."polls" to "postgres";

grant truncate on table "public"."polls" to "postgres";

grant update on table "public"."polls" to "postgres";

grant delete on table "public"."polls" to "service_role";

grant insert on table "public"."polls" to "service_role";

grant references on table "public"."polls" to "service_role";

grant select on table "public"."polls" to "service_role";

grant trigger on table "public"."polls" to "service_role";

grant truncate on table "public"."polls" to "service_role";

grant update on table "public"."polls" to "service_role";

grant delete on table "public"."races" to "anon";

grant insert on table "public"."races" to "anon";

grant references on table "public"."races" to "anon";

grant select on table "public"."races" to "anon";

grant trigger on table "public"."races" to "anon";

grant truncate on table "public"."races" to "anon";

grant update on table "public"."races" to "anon";

grant delete on table "public"."races" to "authenticated";

grant insert on table "public"."races" to "authenticated";

grant references on table "public"."races" to "authenticated";

grant select on table "public"."races" to "authenticated";

grant trigger on table "public"."races" to "authenticated";

grant truncate on table "public"."races" to "authenticated";

grant update on table "public"."races" to "authenticated";

grant delete on table "public"."races" to "postgres";

grant insert on table "public"."races" to "postgres";

grant references on table "public"."races" to "postgres";

grant select on table "public"."races" to "postgres";

grant trigger on table "public"."races" to "postgres";

grant truncate on table "public"."races" to "postgres";

grant update on table "public"."races" to "postgres";

grant delete on table "public"."races" to "service_role";

grant insert on table "public"."races" to "service_role";

grant references on table "public"."races" to "service_role";

grant select on table "public"."races" to "service_role";

grant trigger on table "public"."races" to "service_role";

grant truncate on table "public"."races" to "service_role";

grant update on table "public"."races" to "service_role";

grant delete on table "public"."received_achievements_character" to "anon";

grant insert on table "public"."received_achievements_character" to "anon";

grant references on table "public"."received_achievements_character" to "anon";

grant select on table "public"."received_achievements_character" to "anon";

grant trigger on table "public"."received_achievements_character" to "anon";

grant truncate on table "public"."received_achievements_character" to "anon";

grant update on table "public"."received_achievements_character" to "anon";

grant delete on table "public"."received_achievements_character" to "authenticated";

grant insert on table "public"."received_achievements_character" to "authenticated";

grant references on table "public"."received_achievements_character" to "authenticated";

grant select on table "public"."received_achievements_character" to "authenticated";

grant trigger on table "public"."received_achievements_character" to "authenticated";

grant truncate on table "public"."received_achievements_character" to "authenticated";

grant update on table "public"."received_achievements_character" to "authenticated";

grant delete on table "public"."received_achievements_character" to "postgres";

grant insert on table "public"."received_achievements_character" to "postgres";

grant references on table "public"."received_achievements_character" to "postgres";

grant select on table "public"."received_achievements_character" to "postgres";

grant trigger on table "public"."received_achievements_character" to "postgres";

grant truncate on table "public"."received_achievements_character" to "postgres";

grant update on table "public"."received_achievements_character" to "postgres";

grant delete on table "public"."received_achievements_character" to "service_role";

grant insert on table "public"."received_achievements_character" to "service_role";

grant references on table "public"."received_achievements_character" to "service_role";

grant select on table "public"."received_achievements_character" to "service_role";

grant trigger on table "public"."received_achievements_character" to "service_role";

grant truncate on table "public"."received_achievements_character" to "service_role";

grant update on table "public"."received_achievements_character" to "service_role";

grant delete on table "public"."received_achievements_dm" to "anon";

grant insert on table "public"."received_achievements_dm" to "anon";

grant references on table "public"."received_achievements_dm" to "anon";

grant select on table "public"."received_achievements_dm" to "anon";

grant trigger on table "public"."received_achievements_dm" to "anon";

grant truncate on table "public"."received_achievements_dm" to "anon";

grant update on table "public"."received_achievements_dm" to "anon";

grant delete on table "public"."received_achievements_dm" to "authenticated";

grant insert on table "public"."received_achievements_dm" to "authenticated";

grant references on table "public"."received_achievements_dm" to "authenticated";

grant select on table "public"."received_achievements_dm" to "authenticated";

grant trigger on table "public"."received_achievements_dm" to "authenticated";

grant truncate on table "public"."received_achievements_dm" to "authenticated";

grant update on table "public"."received_achievements_dm" to "authenticated";

grant delete on table "public"."received_achievements_dm" to "postgres";

grant insert on table "public"."received_achievements_dm" to "postgres";

grant references on table "public"."received_achievements_dm" to "postgres";

grant select on table "public"."received_achievements_dm" to "postgres";

grant trigger on table "public"."received_achievements_dm" to "postgres";

grant truncate on table "public"."received_achievements_dm" to "postgres";

grant update on table "public"."received_achievements_dm" to "postgres";

grant delete on table "public"."received_achievements_dm" to "service_role";

grant insert on table "public"."received_achievements_dm" to "service_role";

grant references on table "public"."received_achievements_dm" to "service_role";

grant select on table "public"."received_achievements_dm" to "service_role";

grant trigger on table "public"."received_achievements_dm" to "service_role";

grant truncate on table "public"."received_achievements_dm" to "service_role";

grant update on table "public"."received_achievements_dm" to "service_role";

grant delete on table "public"."received_achievements_player" to "anon";

grant insert on table "public"."received_achievements_player" to "anon";

grant references on table "public"."received_achievements_player" to "anon";

grant select on table "public"."received_achievements_player" to "anon";

grant trigger on table "public"."received_achievements_player" to "anon";

grant truncate on table "public"."received_achievements_player" to "anon";

grant update on table "public"."received_achievements_player" to "anon";

grant delete on table "public"."received_achievements_player" to "authenticated";

grant insert on table "public"."received_achievements_player" to "authenticated";

grant references on table "public"."received_achievements_player" to "authenticated";

grant select on table "public"."received_achievements_player" to "authenticated";

grant trigger on table "public"."received_achievements_player" to "authenticated";

grant truncate on table "public"."received_achievements_player" to "authenticated";

grant update on table "public"."received_achievements_player" to "authenticated";

grant delete on table "public"."received_achievements_player" to "postgres";

grant insert on table "public"."received_achievements_player" to "postgres";

grant references on table "public"."received_achievements_player" to "postgres";

grant select on table "public"."received_achievements_player" to "postgres";

grant trigger on table "public"."received_achievements_player" to "postgres";

grant truncate on table "public"."received_achievements_player" to "postgres";

grant update on table "public"."received_achievements_player" to "postgres";

grant delete on table "public"."received_achievements_player" to "service_role";

grant insert on table "public"."received_achievements_player" to "service_role";

grant references on table "public"."received_achievements_player" to "service_role";

grant select on table "public"."received_achievements_player" to "service_role";

grant trigger on table "public"."received_achievements_player" to "service_role";

grant truncate on table "public"."received_achievements_player" to "service_role";

grant update on table "public"."received_achievements_player" to "service_role";

grant delete on table "public"."roles" to "anon";

grant insert on table "public"."roles" to "anon";

grant references on table "public"."roles" to "anon";

grant select on table "public"."roles" to "anon";

grant trigger on table "public"."roles" to "anon";

grant truncate on table "public"."roles" to "anon";

grant update on table "public"."roles" to "anon";

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";

grant delete on table "public"."roles" to "postgres";

grant insert on table "public"."roles" to "postgres";

grant references on table "public"."roles" to "postgres";

grant select on table "public"."roles" to "postgres";

grant trigger on table "public"."roles" to "postgres";

grant truncate on table "public"."roles" to "postgres";

grant update on table "public"."roles" to "postgres";

grant delete on table "public"."roles" to "service_role";

grant insert on table "public"."roles" to "service_role";

grant references on table "public"."roles" to "service_role";

grant select on table "public"."roles" to "service_role";

grant trigger on table "public"."roles" to "service_role";

grant truncate on table "public"."roles" to "service_role";

grant update on table "public"."roles" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "postgres";

grant insert on table "public"."users" to "postgres";

grant references on table "public"."users" to "postgres";

grant select on table "public"."users" to "postgres";

grant trigger on table "public"."users" to "postgres";

grant truncate on table "public"."users" to "postgres";

grant update on table "public"."users" to "postgres";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

grant delete on table "public"."votes" to "anon";

grant insert on table "public"."votes" to "anon";

grant references on table "public"."votes" to "anon";

grant select on table "public"."votes" to "anon";

grant trigger on table "public"."votes" to "anon";

grant truncate on table "public"."votes" to "anon";

grant update on table "public"."votes" to "anon";

grant delete on table "public"."votes" to "authenticated";

grant insert on table "public"."votes" to "authenticated";

grant references on table "public"."votes" to "authenticated";

grant select on table "public"."votes" to "authenticated";

grant trigger on table "public"."votes" to "authenticated";

grant truncate on table "public"."votes" to "authenticated";

grant update on table "public"."votes" to "authenticated";

grant delete on table "public"."votes" to "postgres";

grant insert on table "public"."votes" to "postgres";

grant references on table "public"."votes" to "postgres";

grant select on table "public"."votes" to "postgres";

grant trigger on table "public"."votes" to "postgres";

grant truncate on table "public"."votes" to "postgres";

grant update on table "public"."votes" to "postgres";

grant delete on table "public"."votes" to "service_role";

grant insert on table "public"."votes" to "service_role";

grant references on table "public"."votes" to "service_role";

grant select on table "public"."votes" to "service_role";

grant trigger on table "public"."votes" to "service_role";

grant truncate on table "public"."votes" to "service_role";

grant update on table "public"."votes" to "service_role";

create policy "Enable ALL for admins and DMs"
on "public"."achievements"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (auth.uid() = roles.auth_user_uuid))) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE ( SELECT (auth.uid() = roles.auth_user_uuid))) <> 'player'::role));


create policy "Enable read access for all users"
on "public"."achievements"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins"
on "public"."campaigns"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable read access for all users"
on "public"."campaigns"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins"
on "public"."character_class"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable ALL for users based on Auth"
on "public"."character_class"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (players
     JOIN characters ON ((players.id = characters.player_uuid)))
  WHERE (characters.id = character_class.character_id))))
with check ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (players
     JOIN characters ON ((players.id = characters.player_uuid)))
  WHERE (characters.id = character_class.character_id))));


create policy "Enable read access for all users"
on "public"."character_class"
as permissive
for select
to public
using (true);


create policy "Enable ALL for DMs and admins"
on "public"."character_party"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role));


create policy "Enable read access for all users"
on "public"."character_party"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins and DMs"
on "public"."character_race"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role));


create policy "Enable ALL for users based on Auth"
on "public"."character_race"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (players
     JOIN characters ON ((players.id = characters.player_uuid)))
  WHERE (characters.id = character_race.character_id))))
with check ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (players
     JOIN characters ON ((players.id = characters.player_uuid)))
  WHERE (characters.id = character_race.character_id))));


create policy "Enable read access for all users"
on "public"."character_race"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins and DMs"
on "public"."characters"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM roles
  WHERE ((roles.auth_user_uuid = auth.uid()) AND (roles.role <> 'player'::role)))))
with check ((EXISTS ( SELECT 1
   FROM roles
  WHERE ((roles.auth_user_uuid = auth.uid()) AND (roles.role <> 'player'::role)))));


create policy "Enable insert for users based on Auth"
on "public"."characters"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM players
  WHERE ((players.id = characters.player_uuid) AND (players.auth_user_uuid = ( SELECT auth.uid() AS uid))))));


create policy "Enable read access for all users"
on "public"."characters"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on Auth"
on "public"."characters"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM players
  WHERE ((players.id = characters.player_uuid) AND (players.auth_user_uuid = ( SELECT auth.uid() AS uid))))))
with check (true);


create policy "Enable ALL for admins and DMs"
on "public"."classes"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role));


create policy "Enable insert for authenticated users only"
on "public"."classes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."classes"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."classes"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable ALL for DMs based on Auth"
on "public"."dm_party"
as permissive
for all
to authenticated
using ((( SELECT dms.auth_user_uuid
   FROM dms
  WHERE (dms.id = dm_party.dm_id)) = ( SELECT auth.uid() AS uid)))
with check ((( SELECT dms.auth_user_uuid
   FROM dms
  WHERE (dms.id = dm_party.dm_id)) = ( SELECT auth.uid() AS uid)));


create policy "Enable ALL for admins"
on "public"."dm_party"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable read access for all users"
on "public"."dm_party"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins"
on "public"."dms"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable read access for all users"
on "public"."dms"
as permissive
for select
to public
using (true);


create policy "Enable update based on Auth"
on "public"."dms"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = auth_user_uuid))
with check ((( SELECT auth.uid() AS uid) = auth_user_uuid));


create policy "Enable insert for authenticated users only"
on "public"."images"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."images"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins"
on "public"."journal"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable read access for all users"
on "public"."journal"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins"
on "public"."options"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable read access for all users"
on "public"."options"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins"
on "public"."parties"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable insert for DMs"
on "public"."parties"
as permissive
for insert
to authenticated
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'dm'::role));


create policy "Enable read access for all users"
on "public"."parties"
as permissive
for select
to public
using (true);


create policy "Enable update for DMs"
on "public"."parties"
as permissive
for update
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable update for related characters from Auth"
on "public"."parties"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT p.auth_user_uuid
   FROM ((character_party cp
     JOIN characters c ON ((c.id = cp.character_id)))
     JOIN players p ON ((c.player_uuid = p.id)))
  WHERE (cp.party_id = parties.id))));


create policy "Enable ALL for admins"
on "public"."party_campaigns"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable read access for all users"
on "public"."party_campaigns"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins"
on "public"."party_entries"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable ALL for party's DM"
on "public"."party_entries"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT dm.auth_user_uuid
   FROM (dm_party dp
     JOIN dms dm ON ((dm.id = dp.dm_id)))
  WHERE (dp.party_id = dp.party_id))))
with check ((( SELECT auth.uid() AS uid) IN ( SELECT dm.auth_user_uuid
   FROM (dm_party dp
     JOIN dms dm ON ((dm.id = dp.dm_id)))
  WHERE (dp.party_id = dp.party_id))));


create policy "Enable UPDATE for PCs in the party"
on "public"."party_entries"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT p.auth_user_uuid
   FROM ((character_party cp
     JOIN characters c ON ((c.id = cp.character_id)))
     JOIN players p ON ((c.player_uuid = p.id)))
  WHERE (cp.party_id = cp.party_id))))
with check ((( SELECT auth.uid() AS uid) IN ( SELECT p.auth_user_uuid
   FROM ((character_party cp
     JOIN characters c ON ((c.id = cp.character_id)))
     JOIN players p ON ((c.player_uuid = p.id)))
  WHERE (cp.party_id = cp.party_id))));


create policy "Enable read access for all users"
on "public"."party_entries"
as permissive
for select
to public
using (true);


create policy "Enable ALL for DMs based on party and auth"
on "public"."players"
as permissive
for all
to authenticated
using (is_dm_for_player(id))
with check (is_dm_for_player(id));


create policy "Enable ALL for admins"
on "public"."players"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable insert for users based on Auth"
on "public"."players"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = auth_user_uuid));


create policy "Enable read access for all users"
on "public"."players"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on Auth"
on "public"."players"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = auth_user_uuid))
with check ((( SELECT auth.uid() AS uid) = auth_user_uuid));


create policy "Enable ALL for admins"
on "public"."polls"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable read access for all users"
on "public"."polls"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins and DMs"
on "public"."races"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role));


create policy "Enable insert for authenticated users only"
on "public"."races"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."races"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."races"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable ALL for admins and DMs"
on "public"."received_achievements_character"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role));


create policy "Enable read access for all users"
on "public"."received_achievements_character"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins"
on "public"."received_achievements_dm"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable read access for all users"
on "public"."received_achievements_dm"
as permissive
for select
to public
using (true);


create policy "Enable ALL for admins and DMs"
on "public"."received_achievements_player"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) <> 'player'::role));


create policy "Enable read access for all users"
on "public"."received_achievements_player"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."roles"
as permissive
for select
to public
using (true);


create policy "Insert based on auth"
on "public"."roles"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = auth_user_uuid));


create policy "Update for admins"
on "public"."roles"
as permissive
for update
to authenticated
using ((( SELECT roles_1.role
   FROM roles roles_1
  WHERE (( SELECT auth.uid() AS uid) = roles_1.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles_1.role
   FROM roles roles_1
  WHERE (( SELECT auth.uid() AS uid) = roles_1.auth_user_uuid)) = 'admin'::role));


create policy "Enable ALL for admins"
on "public"."users"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable insert for users based on auth"
on "public"."users"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = auth_user_uuid));


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on auth"
on "public"."users"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = auth_user_uuid))
with check ((( SELECT auth.uid() AS uid) = auth_user_uuid));


create policy "Enable delete for authenticated users only"
on "public"."votes"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."votes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."votes"
as permissive
for select
to public
using (true);



