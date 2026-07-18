# SINNO Football Club — Management PWA

Single-tenant web app for a grassroots football club: roster management, match-date
voting, and QR-based fund collection. Installable as a PWA on Android & iOS.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, JavaScript) |
| Database | MongoDB Atlas (free M0) via Mongoose 8 |
| Auth | JWT (`jose`) in an httpOnly cookie + `bcryptjs` password hashing |
| Images | Cloudinary (QR codes, avatars) |
| Push | Web Push / VAPID (`web-push`) |
| Styling | Tailwind CSS v3 |
| Hosting | Vercel (single deploy); deadline reminders via an external cron pinger |

## Project structure

```
src/
  app/
    layout.js              Root layout + PWA metadata
    page.js                Home dashboard (auth-gated)
    setup/                 US-1.1 first-admin setup flow
    login/                 US-1.3 login
    api/
      setup/route.js       GET setup status · POST create first admin
      auth/login/route.js  POST login
      auth/logout/route.js POST logout
      auth/me/route.js     GET current user
  components/              Shared client components
  lib/
    db.js                  Cached Mongoose connection
    auth.js                Hashing, JWT sign/verify, session cookie
    currentUser.js         Resolve/guard the logged-in user (requireAdmin, …)
    cloudinary.js          Image upload/delete
    setup.js               First-run detection
    validation.js          Username/password rules
  models/                  User, MatchProposal, Vote, PaymentMethod,
                           FundRequest, Payment, PushSubscription
  middleware.js            Edge auth gate (redirects to /login)
```

## Getting started

> **Prerequisite:** Node.js 18.18+ (or 20+). It is not currently installed on this
> machine — install from https://nodejs.org (LTS) or `winget install OpenJS.NodeJS.LTS`,
> then reopen the terminal so `node` and `npm` are on your PATH.

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Fill in at minimum `MONGODB_URI` and `JWT_SECRET` to boot. Cloudinary and VAPID
   values are only needed once you build the finance/notification epics.
   - Generate a JWT secret: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

3. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000. With an empty database you'll be routed to
   `/setup` to create the first admin; after that, `/login`.

## Build order

1. **Epic 1 — Admin & Accounts** (in progress): first-admin setup, login, session,
   route protection are scaffolded. Remaining: player CRUD, invite links, profile
   editing, promote/demote.
2. **Epic 2 — Match Voting**: models are defined; screens/APIs next.
3. **Epic 3 — Finance/Fund**: models are defined; screens/APIs next.

## Key product decisions (locked)

- Single-tenant (one deploy = one club).
- No system-enforced voting quorum — admin confirms at their discretion.
- Passwords: min 8 chars, no complexity rules. Sessions last 30 days.
- Fund requests target a manually-selected subset of players (no default).
- Soft-delete everywhere (`isActive` / `status`) to preserve history.
- Recurring dues are out of MVP scope (revisit with a "duplicate request" action).
