# Wix-HubSpot Integration

Syncs contacts between Wix and HubSpot in both directions, captures form submissions with UTM tracking, and gives site admins a dashboard to manage field mappings.

Built as a self-hosted Wix app (Next.js on Vercel) because the integration needs its own backend for HubSpot OAuth, webhook processing, and a database for mapping state.

## What it does

- **Contact sync** - when a contact is created or updated on either side, the change gets pushed to the other platform in real-time via webhooks. There's a 3-layer loop prevention system to stop infinite ping-pong between the two.
- **Form capture** - Wix form submissions get matched to HubSpot contact properties using a combination of configured mappings and heuristic name matching. UTM params from the page URL are attached automatically.
- **Field mapping UI** - embedded in the Wix admin as an iframe. Admins can add/remove/toggle mappings, pick transforms (lowercase, uppercase, etc.), and choose sync direction per field.
- **OAuth for both platforms** - tokens are encrypted at rest with AES-256-CBC, auto-refreshed before expiry.

## Stack

- Next.js 16 (App Router) + TypeScript
- MongoDB Atlas
- Vercel (serverless)
- `@hubspot/api-client` SDK
- Tailwind CSS
- Vitest for tests

## Setup

```bash
npm install
cp .env.example .env.local
# fill in the values (see below)
npm run dev
```

### Env vars you need

| Variable | What it is |
|----------|-----------|
| `NEXT_PUBLIC_BASE_URL` | Where the app lives (e.g. `https://your-app.vercel.app`) |
| `WIX_APP_ID` | From Wix Dev Center |
| `WIX_APP_SECRET` | From Wix Dev Center |
| `WIX_WEBHOOK_PUBLIC_KEY` | For verifying Wix webhook signatures |
| `WIX_AUTH_MODE` | `hybrid` (default), `oauth_only`, or `legacy_only` |
| `HUBSPOT_CLIENT_ID` | From HubSpot developer portal |
| `HUBSPOT_CLIENT_SECRET` | From HubSpot developer portal |
| `HUBSPOT_APP_ID` | From HubSpot developer portal |
| `MONGODB_URI` | Atlas connection string |
| `ENCRYPTION_KEY` | Generate with `openssl rand -hex 32` |
| `STATE_SECRET` | Any random string, used to sign OAuth state params |

## Project layout

```
src/
  app/
    api/
      auth/wix/        Wix OAuth (install + callback)
      auth/hubspot/    HubSpot OAuth (connect + callback)
      webhooks/        Incoming webhooks from both platforms
      mappings/        CRUD for field mappings
      fields/          Lists available fields from each platform
      sync/            Manual sync trigger + status
      installation/    Connection status check
    dashboard/         Admin UI (loads inside Wix iframe)
  lib/
    services/          Sync engine, field mapper, form capture, auth
    utils/             Crypto, logging, constants
  types/               TypeScript definitions
tests/unit/            Unit tests
docs/api-plan.md       Full API spec
```

## How the sync works

The tricky part of bidirectional sync is preventing loops. When we sync a Wix contact change to HubSpot, HubSpot fires a webhook for that change, which would trigger a sync back to Wix, and so on forever.

We handle this with three checks:

1. **Event dedup** - every webhook event ID gets stored in a `processed_events` collection with a 24h TTL. If we've seen it, skip.
2. **Echo suppression** - when we write to a platform, we drop a time-bucketed marker (5-second windows). If a webhook comes from the other platform within that window for the same contact, it's almost certainly our own echo.
3. **Data comparison** - before pushing to the target, we compare what we'd write vs what's already there. If nothing actually changed, skip.

Conflicts are resolved with field-level last-write-wins.

## After Installation

If installation starts from the landing page, the user is redirected to a success page:

- `GET /install/success`

Landing installs are tracked with a short-lived server cookie marker (`wix_install_entry=landing`) so the Wix installer redirect URL remains exactly:

- `GET /api/auth/wix/callback`

That page provides direct actions to:

- Open the app dashboard (`/dashboard?instanceId=...` when available)
- Open Wix admin (`https://manage.wix.com/dashboard/sites`)
- Return to home with a success banner (`/?installed=1&instanceId=...`)

For Wix-native app install flow, callback behavior remains Wix-compatible (installer closes as expected).

For step-by-step screenshots, see [docs/deliverables.md](docs/deliverables.md#install--access-walkthrough).

## Running tests

```bash
npm test          # single run
npm run test:watch # watch mode
```

89 tests across the unit suites cover field mapping, webhook verification, form capture, crypto, and Wix OAuth install routing.

## Deploying

```bash
vercel deploy --prod
```

Then configure both platforms:

**Wix Dev Center:**
- App URL -> `{BASE_URL}/api/auth/wix/install`
- Redirect URL -> `{BASE_URL}/api/auth/wix/callback`
- Dashboard component -> `{BASE_URL}/dashboard`
- Webhook subscriptions -> contact created/updated, form submitted
- Permissions -> Contacts (Read/Write), Forms (Read)

**HubSpot Developer Portal:**
- Redirect URI -> `{BASE_URL}/api/auth/hubspot/callback`
- Webhook subscriptions -> contact.creation, contact.propertyChange

## API routes

| Method | Path | What it does |
|--------|------|-------------|
| GET | `/api/auth/wix/install` | Kicks off Wix app installation |
| GET | `/api/auth/wix/callback` | Handles Wix OAuth redirect |
| GET | `/api/auth/hubspot/connect` | Kicks off HubSpot OAuth |
| GET | `/api/auth/hubspot/callback` | Handles HubSpot OAuth redirect |
| POST | `/api/webhooks/wix/contact` | Receives Wix contact events |
| POST | `/api/webhooks/wix/form` | Receives Wix form submissions |
| POST | `/api/webhooks/hubspot` | Receives HubSpot contact events |
| GET/POST/PUT/DELETE | `/api/mappings` | Manage field mappings |
| GET | `/api/fields/wix` | List Wix contact fields |
| GET | `/api/fields/hubspot` | List HubSpot contact properties |
| POST | `/api/sync/trigger` | Run a manual full sync |
| GET | `/api/sync/status` | Check recent sync activity |
| GET | `/api/installation/status` | Check connection health |
| GET | `/install/success` | Post-install success page for manual landing installs |

See [docs/api-plan.md](docs/api-plan.md) for the full spec with request/response schemas.
