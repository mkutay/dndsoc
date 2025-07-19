create policy "Enable read based on email auth"
on "public"."associates_requests"
as permissive
for select
to authenticated
using ((( SELECT (auth.jwt() ->> 'email'::text) AS email) = email));



