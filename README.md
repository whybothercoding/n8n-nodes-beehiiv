# n8n-nodes-beehiiv

[![CI](https://github.com/whybothercoding/n8n-nodes-beehiiv/actions/workflows/ci.yml/badge.svg)](https://github.com/whybothercoding/n8n-nodes-beehiiv/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/%40indiegoweb%2Fn8n-nodes-beehiiv.svg)](https://www.npmjs.com/package/@indiegoweb/n8n-nodes-beehiiv)
[![npm provenance](https://img.shields.io/badge/npm%20provenance-verified-brightgreen)](https://www.npmjs.com/package/@indiegoweb/n8n-nodes-beehiiv)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

Published via npm's [OIDC trusted publishing](https://docs.npmjs.com/generating-provenance-statements) — every release is built and published from GitHub Actions with a verifiable provenance attestation, no long-lived npm token ever stored. See the **Provenance** tab on the [npm package page](https://www.npmjs.com/package/@indiegoweb/n8n-nodes-beehiiv).

This is an n8n community node. It lets you use [Beehiiv](https://www.beehiiv.com/) — the newsletter and publishing platform — in your n8n workflows: manage subscriptions, posts, tiers, segments, automations, webhooks, custom fields, and referral programs against the Beehiiv API v2.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Architecture](#architecture)
[Known gaps](#known-gaps)
[Resources](#resources)
[Development](#development)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The npm package name is `@indiegoweb/n8n-nodes-beehiiv` (scoped — the unscoped `n8n-nodes-beehiiv` belongs to an unrelated package).

## Operations

Every list-style operation supports **Return All** and **Limit**, and walks Beehiiv's cursor pagination automatically — you get one n8n item per record, not one item holding the whole page.

### Publication
- Get, Get Many

### Subscription
- Create, Update, Update by Email, Get, Get by Email, Get Many, Delete
- Add Tag
- Bulk Create, Bulk Update, List Bulk Updates, Get Bulk Update

### Post
- Create, Get, Get Many, Delete
- Get Aggregate Stats, List Templates

### Custom Field
- Create, Get, Get Many, Update, Delete

### Segment
- Create, Get, Get Many, Delete
- Recalculate, List Subscribers

### Automation
- Get, Get Many
- List Journeys, Get Journey, Add Subscription

### Tier
- Create, Get, Get Many, Update (including price/currency via **Prices**)

### Webhook
- Create, Get, Get Many, Update, Delete

### Referral Program
- Get

## Credentials

You'll need a Beehiiv API Key: **Settings → API** in your Beehiiv account. Paste it into the node's **Beehiiv API** credential — it's sent as a `Bearer` token on every request.

## Compatibility

Built and tested against n8n's declarative-routing node API (`n8nNodesApiVersion: 1`) using `@n8n/node-cli`. No known version incompatibilities.

## Usage

Every resource needs a **Publication ID** (`pub_...`) — find it via `Publication → Get Many`, or in the Beehiiv dashboard URL.

**Working with lists.** Turn on **Return All** to fetch every record (the node pages through Beehiiv's cursor pagination for you), or leave it off and set **Limit** for a capped fetch — e.g. `Subscription → Get Many` with Limit 25 returns exactly 25 items, one per subscriber, ready to feed into a loop or a Split in Batches node.

**Updating without clobbering data.** Update-style operations (Subscription Update, Tier Update, Webhook Update) use an **Update Fields** collection: only the fields you explicitly add are sent to Beehiiv. Leaving "Update Fields" empty and just flipping, say, Unsubscribe won't touch the subscriber's email, custom fields, or anything else.

**Tier pricing.** A tier's price isn't a flat field in the Beehiiv API — it's a `Prices` list, since a tier can carry more than one price (e.g. monthly and yearly). Add a row under **Prices** with Currency/Amount/Interval to set a price on create; on update, set a row's **Price ID** to modify an existing price, or **Price ID** + **Delete** to remove one.

**Segment conditions.** `Segment → Create`'s **Where** field is a SQL-like DSL, not free text — e.g. `status = 'active'`, `unique_opens >= 3 AND status = 'active'`, `subscriber_tag = '<tag-uuid>'`. See Beehiiv's segment condition reference for the full field/operator list.

**AI Agent tool.** This node is usable as a tool by n8n's AI Agent node — point an agent at it and it can look up subscribers, create posts, or manage tags on your behalf.

## Architecture

This is a fully **declarative-routing** node — there's no `execute()` method. Every operation is an `INodeProperties` entry with a `routing` block (`nodes/Beehiiv/resources/*/index.ts`), and n8n's routing engine turns each one into an HTTP call.

A few pieces that go beyond what declarative routing gives you for free live in `nodes/Beehiiv/shared/GenericFunctions.ts`:

- **`beehiivListPagination`** — a custom `routing.operations.pagination` function that walks Beehiiv's `cursor`/`has_more` pagination, respecting each operation's Return All / Limit parameters, and returns one `INodeExecutionData` per record.
- **`mergeAdditionalFields`** / **`parseJsonBodyField`** / **`parseBodyJsonStrings`** — `preSend` functions that resolve parameters through `getNodeParameter` rather than a raw `$parameter[...]` routing expression, so JSON-typed fields (bulk arrays, structured post content) and "Additional/Update Fields" collections reach the API as real objects/arrays instead of risking a JSON-encoded string.
- **`mapTierPrices`** — maps the tier **Prices** UI onto Beehiiv's `prices_attributes` shape.

These are plain, unit-tested TypeScript functions (see `*.test.ts` next to each) — see [Development](#development).

## Known gaps

- **Segment → List Subscriber IDs** isn't implemented. Beehiiv's docs reference a "List segment subscriber IDs" page, but its exact method/path couldn't be confirmed against a live reference, and Beehiiv's own official MCP connector doesn't expose it either — both signals pointed away from shipping a guess. Use `Segment → List Subscribers` instead; subscriber IDs are on each returned record.
- **Post → Create** exposes Beehiiv's two real content inputs — **Body Content (HTML)** for the common case, and an advanced **Blocks (JSON)** field for Beehiiv's structured block editor format — rather than a full UI for every block type.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Beehiiv API v2 documentation](https://developers.beehiiv.com/docs/v2/api)

## Development

```bash
npm install
npm run build      # compile + copy assets to dist/
npm test           # jest unit tests (pagination, preSend helpers, node structure)
npm run lint        # n8n community-node lint rules
npm run dev         # run n8n locally with this node loaded
```

## Version history

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE.md)
