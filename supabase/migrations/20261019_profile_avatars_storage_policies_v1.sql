-- RLS para avatares privados, restringidos a la carpeta del usuario.
drop policy if exists "avatars users can read own files" on storage.objects;
create policy "avatars users can read own files" on storage.objects for select to authenticated using (bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid()::text));
drop policy if exists "avatars users can upload own files" on storage.objects;
create policy "avatars users can upload own files" on storage.objects for insert to authenticated with check (bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid()::text));
drop policy if exists "avatars users can update own files" on storage.objects;
create policy "avatars users can update own files" on storage.objects for update to authenticated using (bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid()::text)) with check (bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid()::text));
drop policy if exists "avatars users can delete own files" on storage.objects;
create policy "avatars users can delete own files" on storage.objects for delete to authenticated using (bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid()::text));