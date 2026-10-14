-- DuckTronSur IA Academy: 200 alumnos fundadores y derechos de acceso
-- Estado: EN PRUEBAS. Aplicar solo en una rama de desarrollo de Supabase.
-- No crea planes, precios, cobros, pasarelas ni datos fiscales.

begin;

create table if not exists public.founder_slots (
  slot_number smallint primary key check (slot_number between 1 and 200),
  assigned_user_id uuid unique references auth.users(id) on delete restrict,
  assigned_at timestamptz,
  status text not null default 'available' check (status in ('available', 'assigned', 'revoked')),
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id) on delete restrict,
  revocation_reason text,
  created_at timestamptz not null default now(),
  check (
    (status = 'available' and assigned_user_id is null and assigned_at is null)
    or (status = 'assigned' and assigned_user_id is not null and assigned_at is not null)
    or (status = 'revoked' and assigned_user_id is not null and assigned_at is not null and revoked_at is not null)
  )
);

insert into public.founder_slots (slot_number)
select n::smallint
from generate_series(1, 200) as n
on conflict (slot_number) do nothing;

create table if not exists public.access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  access_scope text not null check (access_scope in ('academy_owned_content')),
  source text not null check (source in ('founder_lifetime', 'manual', 'subscription')),
  status text not null default 'active' check (status in ('active', 'revoked', 'expired')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  founder_slot_number smallint unique references public.founder_slots(slot_number) on delete restrict,
  external_reference text,
  granted_by uuid references auth.users(id) on delete restrict,
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id) on delete restrict,
  revocation_reason text,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at),
  check (
    (source = 'founder_lifetime' and founder_slot_number is not null and ends_at is null)
    or source <> 'founder_lifetime'
  )
);

create unique index if not exists access_grants_one_active_founder_per_user
  on public.access_grants (user_id)
  where source = 'founder_lifetime' and status = 'active';

create index if not exists access_grants_active_lookup
  on public.access_grants (user_id, access_scope, starts_at)
  where status = 'active';

create table if not exists public.access_grant_audit (
  id bigint generated always as identity primary key,
  grant_id uuid references public.access_grants(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  event_type text not null check (event_type in ('founder_claimed', 'revoked', 'reassigned')),
  actor_user_id uuid references auth.users(id) on delete restrict,
  event_at timestamptz not null default now(),
  details jsonb not null default '{}'::jsonb
);

create index if not exists access_grant_audit_user_event_at
  on public.access_grant_audit (user_id, event_at desc);

create table if not exists public.professional_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  professional_title text,
  organization text,
  sector text,
  experience_level text check (experience_level in ('inicio', 'intermedio', 'avanzado', 'profesional')),
  learning_objectives text[] not null default '{}',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (char_length(coalesce(professional_title, '')) <= 120),
  check (char_length(coalesce(organization, '')) <= 160),
  check (char_length(coalesce(sector, '')) <= 120),
  check (cardinality(learning_objectives) <= 8)
);

alter table public.founder_slots enable row level security;
alter table public.access_grants enable row level security;
alter table public.access_grant_audit enable row level security;
alter table public.professional_profiles enable row level security;

revoke all on table public.founder_slots, public.access_grants, public.access_grant_audit, public.professional_profiles from anon, authenticated;
grant select on public.access_grants, public.professional_profiles to authenticated;
grant insert, update on public.professional_profiles to authenticated;

drop policy if exists "users read own access grants" on public.access_grants;
create policy "users read own access grants"
  on public.access_grants for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "users read own professional profile" on public.professional_profiles;
create policy "users read own professional profile"
  on public.professional_profiles for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "users create own professional profile" on public.professional_profiles;
create policy "users create own professional profile"
  on public.professional_profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "users update own professional profile" on public.professional_profiles;
create policy "users update own professional profile"
  on public.professional_profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.set_professional_profile_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists professional_profiles_updated_at on public.professional_profiles;
create trigger professional_profiles_updated_at
before update on public.professional_profiles
for each row execute function public.set_professional_profile_updated_at();

create or replace function public.claim_founder_entitlement()
returns table (claim_state text, founder_number smallint)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid := auth.uid();
  v_slot smallint;
  v_grant_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;

  if not exists (
    select 1
    from auth.users
    where id = v_user_id
      and email_confirmed_at is not null
  ) then
    raise exception 'email_verification_required' using errcode = '42501';
  end if;

  select slot_number into v_slot
  from public.founder_slots
  where assigned_user_id = v_user_id;

  if found then
    return query select 'already_assigned'::text, v_slot;
    return;
  end if;

  perform pg_advisory_xact_lock(hashtextextended('ducktronsur_founders_v1', 0));

  select slot_number into v_slot
  from public.founder_slots
  where status = 'available'
  order by slot_number
  for update skip locked
  limit 1;

  if v_slot is null then
    return query select 'capacity_reached'::text, null::smallint;
    return;
  end if;

  update public.founder_slots
  set assigned_user_id = v_user_id,
      assigned_at = now(),
      status = 'assigned'
  where slot_number = v_slot
    and status = 'available';

  if not found then
    raise exception 'founder_slot_claim_conflict' using errcode = '40001';
  end if;

  insert into public.access_grants (
    user_id, access_scope, source, status, founder_slot_number
  )
  values (
    v_user_id, 'academy_owned_content', 'founder_lifetime', 'active', v_slot
  )
  returning id into v_grant_id;

  insert into public.access_grant_audit (
    grant_id, user_id, event_type, actor_user_id, details
  )
  values (
    v_grant_id, v_user_id, 'founder_claimed', v_user_id,
    jsonb_build_object('slot_number', v_slot)
  );

  return query select 'assigned'::text, v_slot;
end;
$$;

revoke all on function public.claim_founder_entitlement() from public, anon;
grant execute on function public.claim_founder_entitlement() to authenticated;

-- Mitigación de los avisos existentes del asesor de seguridad.
-- Las funciones se ejecutan por triggers internos, no desde el navegador.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

commit;
