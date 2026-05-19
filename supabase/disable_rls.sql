-- Disable RLS on all VerifAI tables so API can read/write freely
alter table candidates   disable row level security;
alter table bgv_checks   disable row level security;
alter table bgv_reports  disable row level security;
alter table documents    disable row level security;
alter table audit_log    disable row level security;

-- Also grant full access to anon role
grant all on candidates  to anon;
grant all on bgv_checks  to anon;
grant all on bgv_reports to anon;
grant all on documents   to anon;
grant all on audit_log   to anon;

-- Verify RLS is disabled
select tablename, rowsecurity from pg_tables 
where tablename in ('candidates','bgv_checks','bgv_reports','documents','audit_log');
