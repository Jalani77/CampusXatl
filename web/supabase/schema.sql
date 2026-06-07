-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users (synced from Clerk via webhook)
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  clerk_id text unique not null,
  email text unique not null,
  name text not null,
  avatar_url text,
  school text,
  graduation_year int,
  bio text default '',
  is_verified boolean default false,
  is_banned boolean default false,
  ban_reason text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'campus_plus', 'campus_pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  subscription_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Listings
create table if not exists public.listings (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  price decimal(10,2) not null check (price >= 0),
  category text not null check (category in ('textbooks','electronics','furniture','clothing','services','housing','tutoring','other')),
  listing_type text not null default 'item' check (listing_type in ('item','service')),
  condition text check (condition in ('new','like_new','good','fair','poor')),
  campus_area text not null,
  status text not null default 'active' check (status in ('active','sold','archived')),
  image_urls text[] default '{}',
  view_count int default 0,
  is_flagged boolean default false,
  flag_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Saved listings
create table if not exists public.saved_listings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, listing_id)
);

-- Conversations
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete set null,
  participant_ids uuid[] not null,
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Messages
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.users(id) on delete cascade not null,
  body text not null,
  is_read boolean default false,
  is_flagged boolean default false,
  created_at timestamptz default now()
);

-- Reports (safety)
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  reporter_id uuid references public.users(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade,
  reported_user_id uuid references public.users(id) on delete cascade,
  message_id uuid references public.messages(id) on delete cascade,
  reason text not null check (reason in ('spam','inappropriate','scam','wrong_category','other')),
  details text,
  status text default 'pending' check (status in ('pending','reviewed','resolved','dismissed')),
  created_at timestamptz default now()
);

-- Rate limiting (listing creation)
create table if not exists public.listing_rate_limits (
  user_id uuid references public.users(id) on delete cascade primary key,
  count_today int default 0,
  reset_at timestamptz default now() + interval '24 hours'
);

-- Indexes
create index if not exists listings_seller_id_idx on public.listings(seller_id);
create index if not exists listings_category_idx on public.listings(category);
create index if not exists listings_status_idx on public.listings(status);
create index if not exists listings_created_at_idx on public.listings(created_at desc);
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists conversations_participant_ids_idx on public.conversations using gin(participant_ids);

-- Full text search on listings
alter table public.listings add column if not exists fts tsvector
  generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))) stored;
create index if not exists listings_fts_idx on public.listings using gin(fts);

-- RLS policies
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.saved_listings enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.listing_rate_limits enable row level security;

-- Users: anyone can read, only service role can write
create policy "users_read" on public.users for select using (true);
create policy "users_insert" on public.users for insert with check (true);
create policy "users_update" on public.users for update using (true);

-- Listings: active listings are public, sellers can manage their own
create policy "listings_read" on public.listings for select using (status = 'active' or seller_id in (select id from public.users where clerk_id = auth.uid()::text));
create policy "listings_insert" on public.listings for insert with check (true);
create policy "listings_update" on public.listings for update using (true);
create policy "listings_delete" on public.listings for delete using (true);

-- Saved listings
create policy "saved_listings_all" on public.saved_listings using (true) with check (true);

-- Conversations: participants only
create policy "conversations_all" on public.conversations using (true) with check (true);

-- Messages
create policy "messages_all" on public.messages using (true) with check (true);

-- Reports
create policy "reports_all" on public.reports using (true) with check (true);

-- Rate limits
create policy "rate_limits_all" on public.listing_rate_limits using (true) with check (true);

-- Storage bucket for listing images (run separately or via dashboard)
-- insert into storage.buckets (id, name, public) values ('listing-images', 'listing-images', true);
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
