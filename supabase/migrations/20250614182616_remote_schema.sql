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

grant delete on table "public"."achievements" to "postgres";

grant insert on table "public"."achievements" to "postgres";

grant references on table "public"."achievements" to "postgres";

grant select on table "public"."achievements" to "postgres";

grant trigger on table "public"."achievements" to "postgres";

grant truncate on table "public"."achievements" to "postgres";

grant update on table "public"."achievements" to "postgres";

grant delete on table "public"."campaigns" to "postgres";

grant insert on table "public"."campaigns" to "postgres";

grant references on table "public"."campaigns" to "postgres";

grant select on table "public"."campaigns" to "postgres";

grant trigger on table "public"."campaigns" to "postgres";

grant truncate on table "public"."campaigns" to "postgres";

grant update on table "public"."campaigns" to "postgres";

grant delete on table "public"."character_class" to "postgres";

grant insert on table "public"."character_class" to "postgres";

grant references on table "public"."character_class" to "postgres";

grant select on table "public"."character_class" to "postgres";

grant trigger on table "public"."character_class" to "postgres";

grant truncate on table "public"."character_class" to "postgres";

grant update on table "public"."character_class" to "postgres";

grant delete on table "public"."character_party" to "postgres";

grant insert on table "public"."character_party" to "postgres";

grant references on table "public"."character_party" to "postgres";

grant select on table "public"."character_party" to "postgres";

grant trigger on table "public"."character_party" to "postgres";

grant truncate on table "public"."character_party" to "postgres";

grant update on table "public"."character_party" to "postgres";

grant delete on table "public"."character_race" to "postgres";

grant insert on table "public"."character_race" to "postgres";

grant references on table "public"."character_race" to "postgres";

grant select on table "public"."character_race" to "postgres";

grant trigger on table "public"."character_race" to "postgres";

grant truncate on table "public"."character_race" to "postgres";

grant update on table "public"."character_race" to "postgres";

grant delete on table "public"."characters" to "postgres";

grant insert on table "public"."characters" to "postgres";

grant references on table "public"."characters" to "postgres";

grant select on table "public"."characters" to "postgres";

grant trigger on table "public"."characters" to "postgres";

grant truncate on table "public"."characters" to "postgres";

grant update on table "public"."characters" to "postgres";

grant delete on table "public"."classes" to "postgres";

grant insert on table "public"."classes" to "postgres";

grant references on table "public"."classes" to "postgres";

grant select on table "public"."classes" to "postgres";

grant trigger on table "public"."classes" to "postgres";

grant truncate on table "public"."classes" to "postgres";

grant update on table "public"."classes" to "postgres";

grant delete on table "public"."dm_party" to "postgres";

grant insert on table "public"."dm_party" to "postgres";

grant references on table "public"."dm_party" to "postgres";

grant select on table "public"."dm_party" to "postgres";

grant trigger on table "public"."dm_party" to "postgres";

grant truncate on table "public"."dm_party" to "postgres";

grant update on table "public"."dm_party" to "postgres";

grant delete on table "public"."dms" to "postgres";

grant insert on table "public"."dms" to "postgres";

grant references on table "public"."dms" to "postgres";

grant select on table "public"."dms" to "postgres";

grant trigger on table "public"."dms" to "postgres";

grant truncate on table "public"."dms" to "postgres";

grant update on table "public"."dms" to "postgres";

grant delete on table "public"."images" to "postgres";

grant insert on table "public"."images" to "postgres";

grant references on table "public"."images" to "postgres";

grant select on table "public"."images" to "postgres";

grant trigger on table "public"."images" to "postgres";

grant truncate on table "public"."images" to "postgres";

grant update on table "public"."images" to "postgres";

grant delete on table "public"."journal" to "postgres";

grant insert on table "public"."journal" to "postgres";

grant references on table "public"."journal" to "postgres";

grant select on table "public"."journal" to "postgres";

grant trigger on table "public"."journal" to "postgres";

grant truncate on table "public"."journal" to "postgres";

grant update on table "public"."journal" to "postgres";

grant delete on table "public"."options" to "postgres";

grant insert on table "public"."options" to "postgres";

grant references on table "public"."options" to "postgres";

grant select on table "public"."options" to "postgres";

grant trigger on table "public"."options" to "postgres";

grant truncate on table "public"."options" to "postgres";

grant update on table "public"."options" to "postgres";

grant delete on table "public"."parties" to "postgres";

grant insert on table "public"."parties" to "postgres";

grant references on table "public"."parties" to "postgres";

grant select on table "public"."parties" to "postgres";

grant trigger on table "public"."parties" to "postgres";

grant truncate on table "public"."parties" to "postgres";

grant update on table "public"."parties" to "postgres";

grant delete on table "public"."party_campaigns" to "postgres";

grant insert on table "public"."party_campaigns" to "postgres";

grant references on table "public"."party_campaigns" to "postgres";

grant select on table "public"."party_campaigns" to "postgres";

grant trigger on table "public"."party_campaigns" to "postgres";

grant truncate on table "public"."party_campaigns" to "postgres";

grant update on table "public"."party_campaigns" to "postgres";

grant delete on table "public"."party_entries" to "postgres";

grant insert on table "public"."party_entries" to "postgres";

grant references on table "public"."party_entries" to "postgres";

grant select on table "public"."party_entries" to "postgres";

grant trigger on table "public"."party_entries" to "postgres";

grant truncate on table "public"."party_entries" to "postgres";

grant update on table "public"."party_entries" to "postgres";

grant delete on table "public"."players" to "postgres";

grant insert on table "public"."players" to "postgres";

grant references on table "public"."players" to "postgres";

grant select on table "public"."players" to "postgres";

grant trigger on table "public"."players" to "postgres";

grant truncate on table "public"."players" to "postgres";

grant update on table "public"."players" to "postgres";

grant delete on table "public"."polls" to "postgres";

grant insert on table "public"."polls" to "postgres";

grant references on table "public"."polls" to "postgres";

grant select on table "public"."polls" to "postgres";

grant trigger on table "public"."polls" to "postgres";

grant truncate on table "public"."polls" to "postgres";

grant update on table "public"."polls" to "postgres";

grant delete on table "public"."races" to "postgres";

grant insert on table "public"."races" to "postgres";

grant references on table "public"."races" to "postgres";

grant select on table "public"."races" to "postgres";

grant trigger on table "public"."races" to "postgres";

grant truncate on table "public"."races" to "postgres";

grant update on table "public"."races" to "postgres";

grant delete on table "public"."received_achievements_character" to "postgres";

grant insert on table "public"."received_achievements_character" to "postgres";

grant references on table "public"."received_achievements_character" to "postgres";

grant select on table "public"."received_achievements_character" to "postgres";

grant trigger on table "public"."received_achievements_character" to "postgres";

grant truncate on table "public"."received_achievements_character" to "postgres";

grant update on table "public"."received_achievements_character" to "postgres";

grant delete on table "public"."received_achievements_dm" to "postgres";

grant insert on table "public"."received_achievements_dm" to "postgres";

grant references on table "public"."received_achievements_dm" to "postgres";

grant select on table "public"."received_achievements_dm" to "postgres";

grant trigger on table "public"."received_achievements_dm" to "postgres";

grant truncate on table "public"."received_achievements_dm" to "postgres";

grant update on table "public"."received_achievements_dm" to "postgres";

grant delete on table "public"."received_achievements_player" to "postgres";

grant insert on table "public"."received_achievements_player" to "postgres";

grant references on table "public"."received_achievements_player" to "postgres";

grant select on table "public"."received_achievements_player" to "postgres";

grant trigger on table "public"."received_achievements_player" to "postgres";

grant truncate on table "public"."received_achievements_player" to "postgres";

grant update on table "public"."received_achievements_player" to "postgres";

grant delete on table "public"."roles" to "postgres";

grant insert on table "public"."roles" to "postgres";

grant references on table "public"."roles" to "postgres";

grant select on table "public"."roles" to "postgres";

grant trigger on table "public"."roles" to "postgres";

grant truncate on table "public"."roles" to "postgres";

grant update on table "public"."roles" to "postgres";

grant delete on table "public"."users" to "postgres";

grant insert on table "public"."users" to "postgres";

grant references on table "public"."users" to "postgres";

grant select on table "public"."users" to "postgres";

grant trigger on table "public"."users" to "postgres";

grant truncate on table "public"."users" to "postgres";

grant update on table "public"."users" to "postgres";

grant delete on table "public"."votes" to "postgres";

grant insert on table "public"."votes" to "postgres";

grant references on table "public"."votes" to "postgres";

grant select on table "public"."votes" to "postgres";

grant trigger on table "public"."votes" to "postgres";

grant truncate on table "public"."votes" to "postgres";

grant update on table "public"."votes" to "postgres";


