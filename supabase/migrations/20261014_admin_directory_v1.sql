-- DuckTronSur IA Academy: directory lookup for admin panel
begin;
create or replace function public.admin_search_users(p_query text default '')
returns table (user_id uuid, email text, display_name text, email_confirmed boolean)
language plpgsql
security definer
stable
set search_path = public, auth
as $$
begin
  if not public.is_academy_admin() then
    raise exception 'admin_required' using errcode = '42501';
  end if;
  return query
  select u.id, u.email::text, coalesce(u.raw_user_meta_data->>'display_name','')::text,
         (u.email_confirmed_at is not null)
  from auth.users u
  where p_query is null or p_query = ''
     or lower(coalesce(u.email,'')) like '%' || lower(trim(p_query)) || '%'
     or lower(coalesce(u.raw_user_meta_data->>'display_name','')) like '%' || lower(trim(p_query)) || '%'
  order by u.created_at desc
  limit 50;
end;
$$;
revoke all on function public.admin_search_users(text) from public, anon;
grant execute on function public.admin_search_users(text) to authenticated;
commit;
