-- Models table: defines each 3D product model
create table if not exists public.models (
  id text primary key,
  name text not null,
  icon_url text not null default '',
  glb_path text not null,
  default_color text not null default '#EFBD4E',
  default_image_url text not null default '/catLogo.png',
  default_image_position jsonb not null default '[0, 0.04, 0.15]',
  default_image_rotation jsonb not null default '[0, 0, 0]',
  default_image_scale numeric not null default 0.15,
  sort_order integer not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Print limits per model
create table if not exists public.print_limits (
  model_id text primary key references public.models(id) on delete cascade,
  max_width_in numeric not null default 14,
  max_height_in numeric not null default 18,
  max_scale numeric not null default 0.40,
  scale_to_inches numeric not null default 35,
  min_dpi integer not null default 300
);

-- Editor options: which tools are enabled per model
create table if not exists public.model_options (
  id uuid primary key default gen_random_uuid(),
  model_id text not null references public.models(id) on delete cascade,
  option_key text not null,
  enabled boolean not null default true,
  unique(model_id, option_key)
);

-- Admin profiles
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Global settings (key-value)
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Enable RLS on all tables
alter table public.models enable row level security;
alter table public.print_limits enable row level security;
alter table public.model_options enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.settings enable row level security;

-- Public read access for models, print_limits, model_options, settings (frontend needs to read)
create policy "public_read_models" on public.models for select using (true);
create policy "public_read_print_limits" on public.print_limits for select using (true);
create policy "public_read_model_options" on public.model_options for select using (true);
create policy "public_read_settings" on public.settings for select using (true);

-- Admin full access (check admin_profiles)
create policy "admin_all_models" on public.models for all using (
  exists (select 1 from public.admin_profiles where id = auth.uid() and is_admin = true)
);
create policy "admin_all_print_limits" on public.print_limits for all using (
  exists (select 1 from public.admin_profiles where id = auth.uid() and is_admin = true)
);
create policy "admin_all_model_options" on public.model_options for all using (
  exists (select 1 from public.admin_profiles where id = auth.uid() and is_admin = true)
);
create policy "admin_all_admin_profiles" on public.admin_profiles for all using (
  exists (select 1 from public.admin_profiles where id = auth.uid() and is_admin = true)
);
create policy "admin_all_settings" on public.settings for all using (
  exists (select 1 from public.admin_profiles where id = auth.uid() and is_admin = true)
);

-- Self-read for admin_profiles
create policy "self_read_admin_profiles" on public.admin_profiles for select using (auth.uid() = id);

-- Seed default models
insert into public.models (id, name, icon_url, glb_path, default_color, default_image_url, default_image_position, default_image_rotation, default_image_scale, sort_order) values
  ('tshirt', 'T-Shirt', '/assets/logo-tshirt.png', '/api/models/shirt_baked.glb', '#EFBD4E', '/catLogo.png', '[0, 0.04, 0.15]', '[0, 0, 0]', 0.15, 0),
  ('poloShirt', 'Polo', '/assets/polo.png', '/api/models/shirt_baked.glb', '#EFBD4E', '/catLogo.png', '[0, 0.04, 0.15]', '[0, 0, 0]', 0.12, 1),
  ('mug', 'Mug', '/assets/mug.png', '/api/models/mug.glb', '#EFBD4E', '/catLogo.png', '[-0.05, 0, 0.08]', '[0, 0, 0]', 0.05, 2),
  ('diary', 'Diary', '/assets/diary.png', '/api/models/low_poly_bookdiary.glb', '#EFBD4E', '/catLogo.png', '[-1, 0.5, -0.01]', '[0, 0, 0]', 0.7, 3)
on conflict (id) do nothing;

-- Seed print limits
insert into public.print_limits (model_id, max_width_in, max_height_in, max_scale, scale_to_inches, min_dpi) values
  ('tshirt', 14, 18, 0.40, 35, 300),
  ('poloShirt', 14, 18, 0.12, 116.67, 300),
  ('mug', 9, 4, 0.12, 75, 300),
  ('diary', 6, 8, 1.5, 4, 300)
on conflict (model_id) do nothing;

-- Seed model options (which editor tools are available per model)
insert into public.model_options (model_id, option_key, enabled) values
  ('tshirt', 'colorpicker', true),
  ('tshirt', 'filepicker', true),
  ('tshirt', 'aipicker', true),
  ('tshirt', 'texture', true),
  ('poloShirt', 'colorpicker', true),
  ('poloShirt', 'filepicker', true),
  ('poloShirt', 'aipicker', true),
  ('poloShirt', 'texture', true),
  ('mug', 'colorpicker', true),
  ('mug', 'filepicker', true),
  ('mug', 'aipicker', true),
  ('mug', 'texture', true),
  ('diary', 'colorpicker', true),
  ('diary', 'filepicker', true),
  ('diary', 'aipicker', true),
  ('diary', 'texture', true)
on conflict (model_id, option_key) do nothing;

-- Seed global settings
insert into public.settings (key, value) values
  ('min_dpi', '300'),
  ('default_model', '"tshirt"'),
  ('image_labels', '"ABCDEFGHIJKLMNOPQRSTUVWXYZ"')
on conflict (key) do nothing;
