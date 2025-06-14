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


