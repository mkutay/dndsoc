create policy "Enable insert for authenticated users only"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (true);



