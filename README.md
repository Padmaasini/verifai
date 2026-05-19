# VerifAI — AI-Powered Background Verification
### Hackathon POC · Tiger Analytics

---

## Setup

### Step 1 — Install
```bash
npm install
```

### Step 2 — Environment variables
```bash
copy .env.example .env.local
notepad .env.local
```
Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` → Supabase → Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → same page
- `GEMINI_API_KEY` → aistudio.google.com → Get API Key

### Step 3 — Database
Supabase → SQL Editor → New Query → paste `supabase/schema.sql` → Run

### Step 4 — Run locally
```bash
npm run dev
```
Open: http://localhost:3000

---

## Push to GitHub & Deploy on Vercel

```bash
git init
git add .
git commit -m "VerifAI initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/verifai.git
git push -u origin main
```

Then:
1. Go to vercel.com → New Project → Import your GitHub repo
2. Add the 3 environment variables
3. Click Deploy → live in 2 minutes

---

## Login Credentials

### HR Portal
- URL: /hr/login
- Email: hr@verifai.com
- Password: verifai2025

---

## Demo Scenario (Arjun Sharma — triggers fraud detection)

| Field | Enter This |
|-------|-----------|
| Full Name | Arjun Sharma |
| Aadhaar | 123412341234 |
| Company | FinTech Corp |
| Institution | VIT University |
| CGPA | 8.9 |
| Employment | Jan 2021 – Dec 2023 |

System will flag:
- CGPA inflation: declared 8.9, verified 7.6 — Medium risk
- Tenure gap: declared 3 years, confirmed 18 months — High risk
- Final: HIGH RISK · Review Required
