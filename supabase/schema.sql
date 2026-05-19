-- VerifAI v3 Full Schema
-- Run this in Supabase SQL Editor

-- Drop existing tables if re-running
drop table if exists audit_log cascade;
drop table if exists bgv_reports cascade;
drop table if exists documents cascade;
drop table if exists bgv_checks cascade;
drop table if exists candidates cascade;

-- 1. Candidates (full onboarding)
create table candidates (
  id                uuid primary key default gen_random_uuid(),
  -- Personal
  full_name         text,
  email             text,
  phone             text,
  dob               text,
  gender            text,
  nationality       text,
  aadhaar           text,
  pan               text,
  passport          text,
  -- Family
  father_name       text,
  mother_name       text,
  marital_status    text,
  spouse_name       text,
  -- Financial
  uan_number        text,
  nps_pran          text,
  -- Job
  job_role          text,
  -- Address history (JSON array)
  addresses         jsonb default '[]',
  -- Employment history (JSON array, up to 5)
  employment        jsonb default '[]',
  -- Education (JSON array)
  education         jsonb default '[]',
  -- References (JSON array, 2 per employer)
  candidate_references jsonb default '[]',
  -- Status
  status            text default 'pending',
  created_at        timestamptz default now()
);

-- 2. BGV Checks
create table bgv_checks (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid references candidates(id),
  check_type    text not null,
  status        text default 'pending',
  severity      text,
  result        jsonb,
  summary       text,
  completed_at  timestamptz,
  created_at    timestamptz default now()
);

-- 3. Documents
create table documents (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid references candidates(id),
  doc_type      text not null,
  storage_path  text,
  file_name     text,
  ocr_result    jsonb,
  uploaded_at   timestamptz default now()
);

-- 4. BGV Reports
create table bgv_reports (
  id              uuid primary key default gen_random_uuid(),
  candidate_id    uuid references candidates(id) unique,
  risk_level      text,
  risk_score      int,
  narrative       text,
  discrepancies   jsonb,
  recommendation  text,
  interview_fraud_detected boolean default false,
  generated_at    timestamptz default now()
);

-- 5. Audit Log
create table audit_log (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  uuid references candidates(id),
  action        text not null,
  actor         text default 'system',
  details       jsonb,
  created_at    timestamptz default now()
);

-- RLS Policies
alter table candidates   enable row level security;
alter table bgv_checks   enable row level security;
alter table documents    enable row level security;
alter table bgv_reports  enable row level security;
alter table audit_log    enable row level security;

create policy "Allow all for POC" on candidates   for all using (true) with check (true);
create policy "Allow all for POC" on bgv_checks   for all using (true) with check (true);
create policy "Allow all for POC" on documents    for all using (true) with check (true);
create policy "Allow all for POC" on bgv_reports  for all using (true) with check (true);
create policy "Allow all for POC" on audit_log    for all using (true) with check (true);

-- Add archived column to candidates (run this separately if tables already exist)
alter table candidates add column if not exists archived boolean default false;
alter table candidates add column if not exists archive_reason text;
alter table candidates add column if not exists archived_at timestamptz;
