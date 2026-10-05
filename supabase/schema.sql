-- DuckTronSur IA Academy · modelo inicial de alumnos
-- Ejecutar en una base Supabase nueva. No contiene datos reales.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  level text not null,
  description text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  position integer not null check (position > 0),
  slug text not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  unique (course_id, position),
  unique (course_id, slug)
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

create policy "students read own profile" on public.profiles for select using (auth.uid() = id);
create policy "students update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "published courses are public" on public.courses for select using (published = true);
create policy "published lessons are public" on public.lessons for select using (published = true);
create policy "students read own enrollments" on public.enrollments for select using (auth.uid() = user_id);
create policy "students read own progress" on public.lesson_progress for select using (auth.uid() = user_id);
create policy "students write own progress" on public.lesson_progress for insert with check (auth.uid() = user_id);
create policy "students update own progress" on public.lesson_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

