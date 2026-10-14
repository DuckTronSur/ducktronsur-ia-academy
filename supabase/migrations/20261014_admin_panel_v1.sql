-- DuckTronSur IA Academy: panel administrativo y asignación de profesores
-- Estado: EN PRUEBAS. No aplicar en producción sin revisar pruebas RLS y RPC.
begin;

create table if not exists public.academy_admins (
  user_id uuid primary key references auth.users(id) on delete restrict,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete restrict
);

insert into public.academy_admins (user_id)
select id from auth.users
where lower(email) = lower('ducktronsur@encuentraelsur.com')
on conflict (user_id) do nothing;

create table if not exists public.academy_instructors (
  user_id uuid primary key references auth.users(id) on delete restrict,
  display_name text not null,
  specialties text[] not null default '{}',
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_course_assignments (
  id uuid primary key default gen_random_uuid(),
  instructor_user_id uuid not null references public.academy_instructors(user_id) on delete restrict,
  course_key text not null check (course_key ~ '^[a-z0-9][a-z0-9_-]{1,63}$'),
  assigned_by uuid not null references public.academy_admins(user_id) on delete restrict,
  status text not null default 'active' check (status in ('active','revoked')),
  assigned_at timestamptz not null default now(),
  revoked_at timestamptz
);

create unique index if not exists academy_course_assignments_active
  on public.academy_course_assignments(instructor_user_id, course_key)
  where status = 'active';

alter table public.academy_admins enable row level security;
alter table public.academy_instructors enable row level security;
alter table public.academy_course_assignments enable row level security;
revoke all on public.academy_admins, public.academy_instructors, public.academy_course_assignments from anon, authenticated;

create or replace function public.is_academy_admin()
returns boolean
language sql
security definer
stable
set search_path = public, auth
as $$
  select exists (
    select 1 from public.academy_admins
    where user_id = auth.uid()
  );
$$;

create or replace function public.admin_list_founder_roster()
returns table (
  slot_number smallint,
  assigned_user_id uuid,
  email text,
  status text,
  assigned_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_academy_admin() then
    raise exception 'admin_required' using errcode = '42501';
  end if;
  return query
  select s.slot_number, s.assigned_user_id, u.email::text, s.status, s.assigned_at
  from public.founder_slots s
  left join auth.users u on u.id = s.assigned_user_id
  order by s.slot_number;
end;
$$;

create or replace function public.admin_list_instructors()
returns table (
  user_id uuid,
  email text,
  display_name text,
  specialties text[],
  status text
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_academy_admin() then
    raise exception 'admin_required' using errcode = '42501';
  end if;
  return query
  select i.user_id, u.email::text, i.display_name, i.specialties, i.status
  from public.academy_instructors i
  join auth.users u on u.id = i.user_id
  order by i.display_name;
end;
$$;

create or replace function public.admin_upsert_instructor(
  p_user_id uuid,
  p_display_name text,
  p_specialties text[] default '{}'
)
returns public.academy_instructors
language plpgsql
security definer
set search_path = public, auth
as $$
declare v_row public.academy_instructors;
begin
  if not public.is_academy_admin() then
    raise exception 'admin_required' using errcode = '42501';
  end if;
  if not exists (select 1 from auth.users where id = p_user_id) then
    raise exception 'user_not_found' using errcode = '22023';
  end if;
  insert into public.academy_instructors(user_id, display_name, specialties)
  values (p_user_id, left(trim(p_display_name), 120), coalesce(p_specialties, '{}'))
  on conflict (user_id) do update
    set display_name = excluded.display_name,
        specialties = excluded.specialties,
        status = 'active',
        updated_at = now()
  returning * into v_row;
  return v_row;
end;
$$;

create or replace function public.admin_assign_course(
  p_instructor_user_id uuid,
  p_course_key text
)
returns public.academy_course_assignments
language plpgsql
security definer
set search_path = public
as $$
declare v_row public.academy_course_assignments;
begin
  if not public.is_academy_admin() then
    raise exception 'admin_required' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.academy_instructors
    where user_id = p_instructor_user_id and status = 'active'
  ) then
    raise exception 'instructor_required' using errcode = '22023';
  end if;
  insert into public.academy_course_assignments(instructor_user_id, course_key, assigned_by)
  values (p_instructor_user_id, lower(trim(p_course_key)), auth.uid())
  on conflict (instructor_user_id, course_key) where status = 'active'
  do update set assigned_at = now(), assigned_by = auth.uid()
  returning * into v_row;
  return v_row;
end;
$$;

revoke all on function public.is_academy_admin() from public, anon;
revoke all on function public.admin_list_founder_roster() from public, anon;
revoke all on function public.admin_list_instructors() from public, anon;
revoke all on function public.admin_upsert_instructor(uuid,text,text[]) from public, anon;
revoke all on function public.admin_assign_course(uuid,text) from public, anon;
grant execute on function public.is_academy_admin() to authenticated;
grant execute on function public.admin_list_founder_roster() to authenticated;
grant execute on function public.admin_list_instructors() to authenticated;
grant execute on function public.admin_upsert_instructor(uuid,text,text[]) to authenticated;
grant execute on function public.admin_assign_course(uuid,text) to authenticated;

commit;
