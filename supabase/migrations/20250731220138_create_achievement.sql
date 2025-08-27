alter table "public"."achievements" alter column "description" set default ''::text;

alter table "public"."achievements" alter column "points" set default 5;

alter table "public"."achievements" alter column "type" set default 'player'::achievement_type;


