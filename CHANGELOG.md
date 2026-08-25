# Changelog

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). From the next release onward, `npm run release` generates this section automatically from conventional commit messages.

## [Unreleased]

## [0.1.1]

Republished via the new GitHub Actions CI pipeline with npm provenance — no functional changes to the node itself. Also: `peerDependencies.n8n-workflow` now correctly pinned to `"*"` per n8n's current lint requirements, and `.github/workflows/publish.yml` replaced with a directly-scripted publish (lint/typecheck/build/test/publish as explicit steps) instead of routing through `n8n-node release`, which needs an interactive terminal and isn't safe to run unattended.

## [0.1.0]

First published release, on `@indiegoweb/n8n-nodes-beehiiv`.

### Fixed

Verified every operation against the real Beehiiv API v2 reference docs and corrected the ones that didn't match:

- **Custom Field**: `create`/`update` now send `display`/`kind` (was `name`/`type`); `update` now uses `PUT` (was `PATCH`).
- **Tier**: pricing is now sent as `prices_attributes` (a `Prices` list supporting multiple prices, update-in-place, and deletion) instead of the non-existent flat `price_cents`/`currency` fields.
- **Webhook**: the real event-type enum replaced a fabricated list (only 3 of the old 13 values were real); `update` no longer sends `url` (not accepted by the API) and gained `description`.
- **Segment**: `Recalculate` now uses `PUT` (was `POST`); `List Subscribers` now hits `.../members` (was `.../subscribers`).
- **Subscription**: `Add Tag` now sends a `tags` array (was a single `tag` string); `Bulk Create` now posts to `/bulk_subscriptions` and `Bulk Update` to `/subscriptions/bulk_actions` (both previously pointed at a non-existent `/subscriptions/bulk`); removed `tags` from `Create` (not accepted by that endpoint) and the unverified `Bulk Update Status` operation (redundant with the corrected Bulk Update, which already supports per-item `unsubscribe`/`tier`).
- **Post**: `Create` now sends Beehiiv's real fields (`title` + `Body Content (HTML)` or an advanced `Blocks (JSON)`) instead of nine fields (`subtitle`, `slug`, `audience`, `schedule_at`, etc.) that endpoint never accepted.

### Added

- Every "Get Many"/list operation now unwraps Beehiiv's `{ data, pagination }` envelope into one n8n item per record, and exposes **Return All** / **Limit** with real cursor-based pagination — previously every list operation silently returned a single item capped at Beehiiv's 10-record default page.
- **Segment → Create**, using the real SQL-like condition DSL (verified against Beehiiv's official MCP connector's `get_segment_schema`/`save_segment`, e.g. `status = 'active'`).
- `create`/`update` operations across Subscription, Post, Tier, and Webhook now use n8n's "Additional Fields" / "Update Fields" collection pattern, so an update only sends the fields you actually touch — previously e.g. `Tier → Update` always sent `price_cents: 0`, silently resetting a tier's price on any rename-only edit.
- Jest unit tests for the shared pagination/preSend helpers and a structural test asserting every operation's routing only references declared parameters.
- CI now type-checks, tests, lints, and builds on every push/PR.

### Removed

- Stray build artifact (`n8n-nodes-beehiiv.tar.gz`) and a broken absolute-path symlink (`beehiiv-mcp-server`) that were committed to the repo.
