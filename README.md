# Poplate 2026 — Lake District Family Trip Planner

A shared availability calendar for the Lake District family trip. Built with Next.js, Supabase, and Framer Motion.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In the **SQL Editor**, run the following:

```sql
create table availability_entries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  date        date not null,
  comment     text,
  created_at  timestamptz default now()
);

-- Prevent duplicate entries for the same person on the same date
create unique index availability_entries_name_date_idx
  on availability_entries (name, date);

-- Enable Row Level Security (public read/write — no auth needed)
alter table availability_entries enable row level security;

create policy "Anyone can read" on availability_entries
  for select using (true);

create policy "Anyone can insert" on availability_entries
  for insert with check (true);

create policy "Anyone can delete" on availability_entries
  for delete using (true);
```

3. Enable Realtime for the `availability_entries` table:
   - In Supabase dashboard → **Database** → **Replication** → enable `availability_entries`

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase URL and anon key (found in **Project Settings → API**):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings
4. Deploy — done!

Your shared URL will be `https://poplate2026.vercel.app` (or your custom domain).

---

## How it works

- **Name-based identity** — no login required. Name is stored in `localStorage` so returning visitors don't need to re-enter it.
- **Click dates** to add your availability. Multi-select then confirm in one go.
- **Click your own marked dates** to remove them (with confirmation).
- **Live updates** via Supabase Realtime — everyone sees changes instantly without refreshing.
- **Best dates panel** highlights the dates with the most overlap.
- **Colour-coded dots** on each date show which family members are free.
