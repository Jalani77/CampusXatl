# CampusXATL — Setup Guide

Follow these steps in order. Each section tells you exactly where to go and what to copy.

---

## 1. Clerk (Auth)

1. Go to [clerk.com](https://clerk.com) → create a new application → name it "CampusXATL"
2. Choose **Email** as the sign-in method (add Google if you want)
3. From your Clerk dashboard → **API Keys** → copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Paste both into `.env.local`
5. In Clerk dashboard → **Webhooks** → Add endpoint:
   - URL: `https://your-vercel-url.vercel.app/api/webhooks/clerk`
   - Events: check `user.created` and `user.updated`
   - Copy the **Signing Secret** → add it to `.env.local` as `CLERK_WEBHOOK_SECRET`

---

## 2. Supabase (Database + Storage + Realtime)

1. Go to [supabase.com](https://supabase.com) → New project → name it "campusxatl"
2. From **Project Settings → API** → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **SQL Editor** → paste the entire contents of `supabase/schema.sql` → Run
4. Go to **Storage** → Create two buckets:
   - `listing-images` — set to **Public**
   - `avatars` — set to **Public**
5. In Storage → Policies for `listing-images`, add a policy: allow authenticated users to INSERT
6. Enable **Realtime** for the `messages` table:
   - Go to **Database → Replication** → enable replication for the `messages` table

---

## 3. Stripe (Payments)

1. Go to [stripe.com](https://stripe.com) → create account
2. From **Developers → API keys** → copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
3. Create two subscription products:
   - **Campus+**: $4/month recurring → copy the Price ID → `STRIPE_CAMPUS_PLUS_PRICE_ID`
   - **Campus Pro**: $9/month recurring → copy the Price ID → `STRIPE_CAMPUS_PRO_PRICE_ID`
4. Go to **Developers → Webhooks** → Add endpoint:
   - URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`
5. Enable the **Customer Portal** at [stripe.com/docs/customer-management](https://stripe.com/docs/customer-management)

---

## 4. Resend (Email)

1. Go to [resend.com](https://resend.com) → create account
2. **API Keys** → Create API Key → copy it → `RESEND_API_KEY`
3. If you have a custom domain, add it under **Domains** — otherwise Resend's shared domain works for testing
4. Update `RESEND_FROM_EMAIL` to match your verified domain, or leave as `onboarding@resend.dev` for testing

---

## 5. Add environment variables to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard) → your project → **Settings → Environment Variables**
2. Add every variable from `.env.local` (all the real values, not placeholders)
3. Set them for **Production**, **Preview**, and **Development**
4. Redeploy: `vercel --prod`

---

## 6. Connect GitHub for auto-deploy

1. In your Vercel project → **Settings → Git**
2. Connect to `github.com/Jalani77/CampusXatl`
3. Set **Root Directory** to `web`
4. From now on, every push to `main` auto-deploys

---

## What each user action does end-to-end

| Action | What happens |
|---|---|
| Sign up | Clerk creates user → webhook fires → user row inserted in Supabase → welcome email sent via Resend |
| Complete onboarding | PATCH /api/users/me updates school + grad year + bio in Supabase |
| Post listing | Safety check (profanity + scam patterns) → rate limit check → plan limit check → insert into `listings` table |
| Upload photo | Client requests signed URL from /api/upload → uploads directly to Supabase Storage → public URL saved with listing |
| Save listing | Toggle row in `saved_listings` table |
| Message seller | Create row in `conversations` → redirect to thread → Supabase Realtime pushes new messages live → email notification sent |
| Upgrade to Campus+ | Stripe Checkout → payment → webhook fires → `subscription_tier` updated in Supabase |
| Cancel subscription | Stripe Customer Portal → webhook fires → tier downgraded to `free` |
| Report listing | Row inserted in `reports` → if 3+ reports, listing `is_flagged = true` → admin email sent |

---

## Local development

```bash
cd web
cp .env.local .env.local.backup  # already has placeholders
# fill in real values from above steps
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
npm run dev
# open http://localhost:3000
```

For Stripe webhooks locally, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
