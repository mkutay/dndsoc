create type "public"."auction_state" as enum ('deleted', 'created', 'listing_approved', 'buy_request', 'signed_off', 'deal_completed');

create type "public"."thingy_type" as enum ('Adventuring Gear', 'Ammunition', 'Artisan’s Tools', 'Explosive', 'Firearm', 'Food and Drink', 'Futuristic', 'Gaming Set', 'Generic Variant', 'Heavy Armor', 'Illegal Drug', 'Instrument', 'Light Armor', 'Martial Weapon', 'Medium Armor', 'Melee Weapon', 'Modern', 'Mount', 'Other', 'Poison', 'Potion', 'Ranged Weapon', 'Renaissance', 'Ring', 'Rod', 'Scroll', 'Shield', 'Simple Weapon', 'Spellcasting Focus', 'Staff', 'Tack and Harness', 'Tattoo', 'Tool', 'Trade Bar', 'Trade Good', 'Treasure (Art Object)', 'Treasure (Coinage)', 'Treasure (Gemstone)', 'Vehicle (Air)', 'Vehicle (Land)', 'Vehicle (Space)', 'Vehicle (Water)', 'Wand', 'Wondrous Item');

create table "public"."auction" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "seller_id" uuid not null,
    "thingy_id" uuid not null,
    "buyer_id" uuid,
    "valid" boolean not null default true,
    "previous" uuid,
    "status" auction_state not null default 'created'::auction_state
);


alter table "public"."auction" enable row level security;

create table "public"."character_owns" (
    "character_id" uuid not null,
    "thingy_id" uuid not null,
    "public" boolean not null default false,
    "owned_date" timestamp with time zone not null default now()
);


alter table "public"."character_owns" enable row level security;

create table "public"."thingy" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "description" text not null,
    "amount" bigint not null default '1'::bigint,
    "tags" thingy_type[] not null,
    "previous" uuid,
    "shortened" text not null
);


alter table "public"."thingy" enable row level security;

CREATE UNIQUE INDEX auction_pkey ON public.auction USING btree (id);

CREATE UNIQUE INDEX character_owns_pkey ON public.character_owns USING btree (character_id, thingy_id);

CREATE UNIQUE INDEX thingy_pkey ON public.thingy USING btree (id);

CREATE UNIQUE INDEX thingy_shortened_key ON public.thingy USING btree (shortened);

alter table "public"."auction" add constraint "auction_pkey" PRIMARY KEY using index "auction_pkey";

alter table "public"."character_owns" add constraint "character_owns_pkey" PRIMARY KEY using index "character_owns_pkey";

alter table "public"."thingy" add constraint "thingy_pkey" PRIMARY KEY using index "thingy_pkey";

alter table "public"."auction" add constraint "auction_buyer_id_fkey" FOREIGN KEY (buyer_id) REFERENCES characters(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."auction" validate constraint "auction_buyer_id_fkey";

alter table "public"."auction" add constraint "auction_previous_fkey" FOREIGN KEY (previous) REFERENCES auction(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."auction" validate constraint "auction_previous_fkey";

alter table "public"."auction" add constraint "auction_seller_id_fkey" FOREIGN KEY (seller_id) REFERENCES characters(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."auction" validate constraint "auction_seller_id_fkey";

alter table "public"."auction" add constraint "auction_thingy_id_fkey" FOREIGN KEY (thingy_id) REFERENCES thingy(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."auction" validate constraint "auction_thingy_id_fkey";

alter table "public"."character_owns" add constraint "character_owns_character_id_fkey" FOREIGN KEY (character_id) REFERENCES characters(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."character_owns" validate constraint "character_owns_character_id_fkey";

alter table "public"."character_owns" add constraint "character_owns_thingy_id_fkey" FOREIGN KEY (thingy_id) REFERENCES thingy(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."character_owns" validate constraint "character_owns_thingy_id_fkey";

alter table "public"."thingy" add constraint "thingy_previous_fkey" FOREIGN KEY (previous) REFERENCES thingy(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."thingy" validate constraint "thingy_previous_fkey";

alter table "public"."thingy" add constraint "thingy_shortened_key" UNIQUE using index "thingy_shortened_key";

grant delete on table "public"."auction" to "anon";

grant insert on table "public"."auction" to "anon";

grant references on table "public"."auction" to "anon";

grant select on table "public"."auction" to "anon";

grant trigger on table "public"."auction" to "anon";

grant truncate on table "public"."auction" to "anon";

grant update on table "public"."auction" to "anon";

grant delete on table "public"."auction" to "authenticated";

grant insert on table "public"."auction" to "authenticated";

grant references on table "public"."auction" to "authenticated";

grant select on table "public"."auction" to "authenticated";

grant trigger on table "public"."auction" to "authenticated";

grant truncate on table "public"."auction" to "authenticated";

grant update on table "public"."auction" to "authenticated";

grant delete on table "public"."auction" to "service_role";

grant insert on table "public"."auction" to "service_role";

grant references on table "public"."auction" to "service_role";

grant select on table "public"."auction" to "service_role";

grant trigger on table "public"."auction" to "service_role";

grant truncate on table "public"."auction" to "service_role";

grant update on table "public"."auction" to "service_role";

grant delete on table "public"."character_owns" to "anon";

grant insert on table "public"."character_owns" to "anon";

grant references on table "public"."character_owns" to "anon";

grant select on table "public"."character_owns" to "anon";

grant trigger on table "public"."character_owns" to "anon";

grant truncate on table "public"."character_owns" to "anon";

grant update on table "public"."character_owns" to "anon";

grant delete on table "public"."character_owns" to "authenticated";

grant insert on table "public"."character_owns" to "authenticated";

grant references on table "public"."character_owns" to "authenticated";

grant select on table "public"."character_owns" to "authenticated";

grant trigger on table "public"."character_owns" to "authenticated";

grant truncate on table "public"."character_owns" to "authenticated";

grant update on table "public"."character_owns" to "authenticated";

grant delete on table "public"."character_owns" to "service_role";

grant insert on table "public"."character_owns" to "service_role";

grant references on table "public"."character_owns" to "service_role";

grant select on table "public"."character_owns" to "service_role";

grant trigger on table "public"."character_owns" to "service_role";

grant truncate on table "public"."character_owns" to "service_role";

grant update on table "public"."character_owns" to "service_role";

grant delete on table "public"."thingy" to "anon";

grant insert on table "public"."thingy" to "anon";

grant references on table "public"."thingy" to "anon";

grant select on table "public"."thingy" to "anon";

grant trigger on table "public"."thingy" to "anon";

grant truncate on table "public"."thingy" to "anon";

grant update on table "public"."thingy" to "anon";

grant delete on table "public"."thingy" to "authenticated";

grant insert on table "public"."thingy" to "authenticated";

grant references on table "public"."thingy" to "authenticated";

grant select on table "public"."thingy" to "authenticated";

grant trigger on table "public"."thingy" to "authenticated";

grant truncate on table "public"."thingy" to "authenticated";

grant update on table "public"."thingy" to "authenticated";

grant delete on table "public"."thingy" to "service_role";

grant insert on table "public"."thingy" to "service_role";

grant references on table "public"."thingy" to "service_role";

grant select on table "public"."thingy" to "service_role";

grant trigger on table "public"."thingy" to "service_role";

grant truncate on table "public"."thingy" to "service_role";

grant update on table "public"."thingy" to "service_role";

create policy "Enable insert based on auth"
on "public"."character_owns"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (players
     JOIN characters ON ((characters.player_uuid = players.id)))
  WHERE (character_owns.character_id = characters.id))));


create policy "Enable read for based on auth"
on "public"."character_owns"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = ( SELECT players.auth_user_uuid
   FROM (players
     JOIN characters ON ((characters.player_uuid = players.id)))
  WHERE (character_owns.character_id = characters.id))));


create policy "Enable read for public ones"
on "public"."character_owns"
as permissive
for select
to public
using ((public = true));


create policy "Enable ALL for admins"
on "public"."thingy"
as permissive
for all
to authenticated
using ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role))
with check ((( SELECT roles.role
   FROM roles
  WHERE (( SELECT auth.uid() AS uid) = roles.auth_user_uuid)) = 'admin'::role));


create policy "Enable insert for authenticated users only"
on "public"."thingy"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."thingy"
as permissive
for select
to public
using (true);



