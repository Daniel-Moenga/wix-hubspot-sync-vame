# API Plan - Wix-HubSpot Contact Integration

## Overview

This is a Wix marketplace app that keeps contacts in sync between a Wix site and a HubSpot CRM portal. It runs as a self-hosted Next.js app on Vercel, with MongoDB for persistence. The dashboard gets embedded as an iframe inside the Wix admin panel.

I went with self-hosted (instead of Wix CLI native) because this integration needs things Wix backend extensions don't support well: HubSpot OAuth flows, persistent webhook dedup state, and a real database for contact mapping records.

### What it covers

- Two-way contact sync via webhooks, with loop prevention
- Wix form submissions pushed to HubSpot with UTM attribution
- OAuth 2.0 for both Wix and HubSpot, tokens encrypted at rest
- Admin dashboard for managing field mappings

### Stack

Next.js 16 (App Router, TypeScript), MongoDB Atlas, Vercel, `@hubspot/api-client` SDK, Tailwind CSS, Vitest.

---

## Architecture

```
+------------------+          +------------------+
|   Wix Platform   |          | HubSpot CRM      |
|                  |          |                   |
|  Contacts API    |<-------->|  Contacts API     |
|  Forms API       |          |  Properties API   |
|  Webhooks        |          |  Webhooks         |
|  OAuth 2.0       |          |  OAuth 2.0        |
+--------+---------+          +--------+----------+
         |                             |
         |  webhooks / API calls       |
         |                             |
+--------v-----------------------------v----------+
|              Next.js on Vercel                   |
|                                                  |
|  API Routes:                                     |
|    /api/auth/*         OAuth flows               |
|    /api/webhooks/*     Webhook receivers          |
|    /api/mappings       Field mapping CRUD         |
|    /api/fields/*       Field listings             |
|    /api/sync/*         Manual sync + status       |
|    /api/installation/* Connection status           |
|                                                  |
|  Services:                                       |
|    sync-engine.ts      Bidirectional sync logic   |
|    field-mapper.ts     Field transform engine     |
|    form-capture.ts     Form + UTM processing      |
|                                                  |
|  Dashboard:                                      |
|    /dashboard          Wix admin iframe            |
+--------------------------+-----------------------+
                           |
                +----------v-----------+
                |   MongoDB Atlas      |
                |   5 collections      |
                +----------------------+
```

The app sits in the middle. Wix and HubSpot both send webhooks when contacts change. The app receives them, checks for loops, maps the fields, and pushes the changes to the other side.

---

## Auth Flows

### Wix OAuth

When a Wix site owner installs the app:

1. Wix hits `GET /api/auth/wix/install` with an install token
2. We redirect to Wix's authorization URL
3. User grants permissions
4. Wix redirects to `GET /api/auth/wix/callback` with an auth code
5. We exchange the code for tokens, encrypt them, store in MongoDB
6. We create 6 default field mappings (name, email, phone, company, job title)
7. Redirect the user back to their Wix dashboard

Wix access tokens expire every 5 minutes, so we refresh them automatically with a 30-second buffer. The refresh token lasts longer but we always store the latest one.

**Permissions needed:** Contacts.Read, Contacts.Write, Forms.Read

### HubSpot OAuth

Triggered when the admin clicks "Connect HubSpot" in the dashboard:

1. `GET /api/auth/hubspot/connect` generates a signed state param (HMAC-SHA256 with instanceId + timestamp) and redirects to HubSpot
2. User picks a HubSpot portal and grants access
3. HubSpot redirects to `GET /api/auth/hubspot/callback`
4. We verify the state signature, exchange the code for tokens, encrypt and store them
5. We create 5 custom UTM properties in their HubSpot portal (utm_source, utm_medium, etc.)
6. The popup closes and sends a postMessage to the parent dashboard

HubSpot tokens last 30 minutes. Same auto-refresh pattern with a 60-second buffer.

**Scopes needed:** crm.objects.contacts.read, crm.objects.contacts.write, crm.schemas.contacts.read

### Token encryption

All tokens go through AES-256-CBC before hitting the database. Format is `iv:ciphertext` (both hex-encoded). The 32-byte key lives in an env var, never in source.

---

## API Endpoints

### Auth routes

| Method | Path | What it does |
|--------|------|-------------|
| GET | `/api/auth/wix/install` | Entry point for Wix app installation. Takes `?token=` and redirects to Wix. |
| GET | `/api/auth/wix/callback` | Wix sends the user back here with `?code=&instanceId=&state=`. Exchanges code, stores tokens, sets up default mappings. Redirects to Wix dashboard. |
| GET | `/api/auth/hubspot/connect` | Takes `?instanceId=`, signs an OAuth state, redirects to HubSpot. |
| GET | `/api/auth/hubspot/callback` | HubSpot sends the user back here with `?code=&state=`. Verifies state, exchanges code, stores tokens, creates UTM properties. Returns HTML that closes the popup. |

### Webhook routes

All webhook handlers return 200 immediately (to avoid platform retries) and process async.

| Method | Path | What it does |
|--------|------|-------------|
| POST | `/api/webhooks/wix/contact` | Receives Wix contact created/updated events. Verifies JWT signature, dedup-checks, triggers sync to HubSpot. |
| POST | `/api/webhooks/wix/form` | Receives Wix form submissions. Extracts fields, matches to HubSpot properties (heuristic + configured mappings), extracts UTM params, upserts contact in HubSpot. |
| POST | `/api/webhooks/hubspot` | Receives a batch of HubSpot events. Verifies HMAC-SHA256 signature, looks up installation by portal ID, triggers sync to Wix for each event. |

**Wix webhook verification:** JWT with ES256, verified against Wix's public key.

**HubSpot webhook verification:** HMAC-SHA256 (v3) using `X-HubSpot-Signature-v3` header. Checks that the timestamp is within 5 minutes. Falls back to v1 (SHA-256 hash) if v3 headers are missing.

### Field mapping routes

All require `instanceId` as a query param or in the request body.

**GET /api/mappings** - returns all mappings for the installation, sorted with defaults first.

**POST /api/mappings** - creates a new mapping. Required fields: `instanceId`, `wixField`, `hubspotProperty`. Optional: `wixFieldLabel`, `hubspotPropertyLabel`, `transformType`, `transformConfig`, `direction`.

Example request:
```json
{
  "instanceId": "abc-123",
  "wixField": "info.company",
  "wixFieldLabel": "Company",
  "hubspotProperty": "company",
  "hubspotPropertyLabel": "Company Name",
  "transformType": "identity",
  "direction": "both"
}
```

**PUT /api/mappings** - updates an existing mapping. Takes `instanceId`, `mappingId`, and any fields to change (`wixField`, `hubspotProperty`, `transformType`, `transformConfig`, `direction`, `isActive`).

**DELETE /api/mappings** - deletes a mapping. Query params: `instanceId`, `mappingId`.

### Field listing routes

**GET /api/fields/wix?instanceId=...** - returns the static list of Wix contact fields (13 fields: name, email, phone, company, job title, birthday, addresses, etc.)

**GET /api/fields/hubspot?instanceId=...** - fetches available contact properties from HubSpot's API. Filters out hidden and non-form fields. Returns name, label, type for each.

### Sync routes

**POST /api/sync/trigger** - kicks off a manual full sync. Queries all Wix contacts and runs `syncWixToHubSpot()` for each one. Returns counts of synced/skipped/failed.

```json
{
  "message": "Sync started",
  "results": {
    "total": 25,
    "synced": 23,
    "skipped": 1,
    "failed": 1,
    "errors": ["Failed to sync contact abc123: ..."]
  }
}
```

**GET /api/sync/status?instanceId=...** - returns recent sync errors and contact mapping counts.

### Installation status

**GET /api/installation/status?instanceId=...** - quick health check. Returns whether Wix and HubSpot are connected, portal ID, mapping counts, synced contacts, error count.

---

## Data Model

Five MongoDB collections:

### installations

One doc per Wix site that has installed the app. Holds encrypted OAuth tokens for both platforms, portal IDs, sync toggle, timestamps.

```
wixInstanceId        (unique index)
wixAccessToken       encrypted
wixRefreshToken      encrypted
wixTokenExpiresAt    Date
hubspotAccessToken   encrypted, nullable
hubspotRefreshToken  encrypted, nullable
hubspotTokenExpiresAt Date, nullable
hubspotPortalId      sparse index (for webhook lookups)
syncEnabled          boolean
installedAt          Date
updatedAt            Date
```

### field_mappings

User-configurable mappings between Wix contact field paths and HubSpot property names. Six default mappings created on install.

```
wixInstanceId        indexed
wixField             e.g. "info.name.first"
wixFieldLabel        e.g. "First Name"
hubspotProperty      e.g. "firstname"
hubspotPropertyLabel e.g. "First Name"
transformType        "identity" | "lowercase" | "uppercase" | "date_format" | "enum_map"
transformConfig      nullable, used for enum_map configs
direction            "wix_to_hubspot" | "hubspot_to_wix" | "both"
isActive             boolean
isDefault            boolean (true for the 6 auto-created ones)
createdAt, updatedAt
```

Transforms:
- `identity` - pass through as-is
- `lowercase` - `.toLowerCase()` (useful for emails)
- `uppercase` - `.toUpperCase()`
- `date_format` - converts to timestamp (for cross-platform date handling)
- `enum_map` - maps values using a config object, e.g. `{"mr": "Mr.", "ms": "Ms."}`

### contact_mappings

Links Wix contact IDs to HubSpot contact IDs. This is how we know which contacts are already synced.

```
wixInstanceId + wixContactId       unique compound index
wixInstanceId + hubspotContactId   unique compound index
wixInstanceId + email              indexed (for lookup by email)
lastSyncedAt                       Date
lastSyncDirection                  "wix_to_hubspot" | "hubspot_to_wix"
```

### processed_events

Webhook dedup table. Every event ID we process goes here. MongoDB TTL index auto-deletes after 24 hours.

```
eventId              unique index
source               "wix" | "hubspot"
processedAt          Date
expiresAt            Date (TTL index, 24h)
```

### sync_errors

Failed sync attempts. Auto-expires after 7 days via TTL. Surfaced in the dashboard.

```
wixInstanceId        indexed
direction
errorMessage
errorStack
sourceData           the data that failed to sync
resolvedAt           nullable
expiresAt            Date (TTL index, 7d)
createdAt
```

---

## Sync Engine

This is the core of the app. The main challenge is preventing infinite loops.

### The loop problem

1. Admin updates a contact in Wix
2. Wix fires a webhook to us
3. We sync the change to HubSpot
4. HubSpot fires a webhook for the change we just made
5. We sync it back to Wix (oops)
6. Wix fires another webhook... and we're stuck in a loop

### How we prevent it (3 layers)

**Layer 1 - Event dedup.** Every webhook has a unique event ID. Before doing anything, we check if we've already processed it. If yes, skip. Events are stored with a 24-hour TTL so the collection stays small.

**Layer 2 - Echo suppression.** When we write to a platform, we store a time-bucketed marker (5-second buckets). When a webhook comes in from the opposite platform for the same contact, we check if there's a recent marker. If the write happened in the current or previous time bucket, it's almost certainly our own echo. Skip it.

**Layer 3 - Data comparison.** Even if layers 1 and 2 don't catch it, we compare the mapped field values against what's already in the target system. If every field is identical, there's nothing to sync. This catches any edge cases the other layers miss.

### Conflict resolution

Field-level last-write-wins. If both sides changed the same contact, the most recent modification timestamp determines which values to keep. Not perfect for all cases, but it's predictable and works well for the typical use case where one side is the "source of truth" at any given moment.

### Manual sync

The dashboard has a "Sync Now" button that queries all Wix contacts and runs them through the sync engine one at a time. Respects rate limits by processing sequentially.

---

## Form & Lead Capture

When a visitor fills out a Wix form, the app tries to create or update a HubSpot contact from the submission.

### Field matching strategy

Three levels, tried in order:

1. **Explicit mapping** - if the admin has set up a field mapping where the label matches the form field name, use that
2. **Heuristic matching** - we have a lookup table that maps common field names to HubSpot properties (e.g. "first_name", "First Name", "fname" all map to `firstname`)
3. **Skip** - if we can't match it, we log it and move on

### UTM tracking

The app extracts `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content` from the page URL where the form was submitted. These get attached to the HubSpot contact as custom properties (which the app creates automatically when HubSpot is first connected).

---

## Dashboard

The dashboard renders at `/dashboard` and gets embedded in the Wix admin via an iframe. It reads the `instanceId` from Wix's iframe URL params.

### Sections

1. **Connection status** - four cards showing Wix status, HubSpot status (with portal ID), synced contacts count, and error count
2. **Connect HubSpot** - button that opens a popup window for the OAuth flow. When done, the popup sends a postMessage back and the dashboard refreshes.
3. **Field mappings** - table showing all configured mappings with toggle switches, direction indicators, transform badges. "Add Mapping" button opens a modal with dropdowns for Wix fields, HubSpot properties, transform type, and direction.
4. **Sync panel** - shows last sync info and a "Sync Now" button

### Security

The CSP `frame-ancestors` header is set to only allow embedding from `*.wix.com` and `*.editorx.com`.

---

## Error Handling

- All API routes validate required params and return 400 for missing ones
- Webhook handlers always return 200 (to prevent platform retries) and process async
- Sync failures get recorded in `sync_errors` with full context (direction, source data, error message)
- The dashboard surfaces error counts and recent errors
- Errors auto-expire after 7 days via MongoDB TTL

### Rate limits

| Platform | Limit | Our approach |
|----------|-------|-------------|
| Wix REST API | ~200 req/min | Sequential processing |
| HubSpot API | 100 req/10s | SDK has built-in rate limiting |
| MongoDB Atlas (free tier) | Shared cluster | Connection pooling singleton |

---

## Security

- Tokens encrypted with AES-256-CBC at rest (random IV per encryption)
- OAuth state params signed with HMAC-SHA256 to prevent CSRF
- Wix webhooks verified via JWT signature
- HubSpot webhooks verified via HMAC-SHA256 with timestamp check
- Only minimum-required OAuth scopes requested
- Temporary data (processed events, sync errors) auto-cleaned via TTL indexes
- Secrets in env vars, never committed

---

## Default Field Mappings

Created automatically when a Wix site installs the app:

| Wix Field | HubSpot Property | Transform |
|-----------|-----------------|-----------|
| `info.name.first` | `firstname` | identity |
| `info.name.last` | `lastname` | identity |
| `primaryInfo.email` | `email` | lowercase |
| `primaryInfo.phone` | `phone` | identity |
| `info.company` | `company` | identity |
| `info.jobTitle` | `jobtitle` | identity |

All are bidirectional and active by default. Users can change or remove them from the dashboard.

---

## Env Vars

| Variable | What |
|----------|------|
| `NEXT_PUBLIC_BASE_URL` | App URL |
| `WIX_APP_ID` | Wix Dev Center app ID |
| `WIX_APP_SECRET` | Wix app secret |
| `WIX_WEBHOOK_PUBLIC_KEY` | For webhook JWT verification |
| `HUBSPOT_CLIENT_ID` | HubSpot app client ID |
| `HUBSPOT_CLIENT_SECRET` | HubSpot app client secret |
| `HUBSPOT_APP_ID` | HubSpot app ID |
| `MONGODB_URI` | Atlas connection string |
| `ENCRYPTION_KEY` | 32-byte hex, for AES-256-CBC |
| `STATE_SECRET` | Random string, for OAuth state HMAC |

---

## Deployment Checklist

1. Push to GitHub
2. Deploy to Vercel, set env vars
3. In Wix Dev Center:
  - App URL → `{BASE_URL}/api/auth/wix/install`
  - Redirect URL → `{BASE_URL}/api/auth/wix/callback`
  - Dashboard extension → `{BASE_URL}/dashboard`
  - Subscribe to webhooks: contact created/updated, form submitted
4. In HubSpot Developer Portal:
  - Redirect URI → `{BASE_URL}/api/auth/hubspot/callback`
  - Subscribe to: contact.creation, contact.propertyChange
5. Test: install on a Wix site, connect HubSpot, create a contact on each side, verify sync works
