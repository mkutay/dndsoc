drop policy "Enable read access for public ones" on "public"."auction";

alter table "public"."auction" drop column "valid";


  create policy "Enable read access for public ones"
  on "public"."auction"
  as permissive
  for select
  to public
using (((next IS NULL) AND ((status = 'listing_approved'::auction_state) OR (status = 'buy_request'::auction_state))));



