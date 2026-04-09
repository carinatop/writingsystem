create extension if not exists "pgcrypto";

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  niche text,
  target_audience text,
  cta_style text,
  positioning_notes text,
  seo_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_keyword text not null,
  content_type text check (content_type in ('article','blog','newsletter')),
  status text default 'idea',
  qa_score numeric(5,2),
  export_status text default 'not_started',
  pdf_available boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists workflow_events (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null,
  stage_key text not null,
  stage_label text not null,
  state text not null,
  detail text,
  created_at timestamptz default now()
);

create index if not exists idx_brands_user_id on brands(user_id);
create index if not exists idx_content_brand_id on content_items(brand_id);
create index if not exists idx_content_status on content_items(status);
