alter table "public"."auction" add column "next" uuid;

alter table "public"."auction" add constraint "auction_next_fkey" FOREIGN KEY (next) REFERENCES auction(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."auction" validate constraint "auction_next_fkey";


