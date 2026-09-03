#!/bin/bash
# Installs this node into ~/.n8n/custom/ on a self-hosted n8n instance, from
# a pre-built tarball (e.g. `npm pack`, renamed to n8n-nodes-beehiiv.tar.gz).
#
# DECIDED 2026-09-04: nodes developed in-house (this one, Freedom24) go in
# ~/.n8n/custom/, not ~/.n8n/nodes/node_modules/ — reversing the 2026-08-25
# guidance below. The node registers under the flat type "CUSTOM.beehiiv",
# not the real scoped "@indiegoweb/n8n-nodes-beehiiv.beehiiv" name -
# CustomDirectoryLoader globs **/*.node.js directly and ignores
# package.json entirely. That's an accepted tradeoff for self-developed
# nodes, not a bug to fix.
#
# ~/.n8n/nodes/node_modules/ remains correct ONLY for a genuine third-party
# published community package installed through n8n's real Community Nodes
# flow (Settings -> Community Nodes -> Install, or POST
# /rest/community-packages) - that flow writes the required
# installed_packages DB row. Confirmed empirically 2026-09-04 by querying
# the instance's database.sqlite directly: a package manually copied into
# nodes/node_modules WITHOUT going through that flow has no
# installed_packages row and is never loaded at boot on this n8n version
# (2.37.7) - it sat there silently, doing nothing, for weeks. This resolves
# the "EARLIER CLAIM CORRECTED" ambiguity noted below in favor of the
# DB-row-required reading.
#
# ─── HISTORY (kept for context - the scoping investigation still applies if
# this package is ever installed via the real Community Nodes flow instead) ───
#
# The package is scoped (@indiegoweb/n8n-nodes-beehiiv), because the
# unscoped name n8n-nodes-beehiiv is already taken on the npm registry by an
# unrelated package - confirmed 2026-08-25 via `npm view n8n-nodes-beehiiv`.
# n8n's CommunityPackagesService (packages/cli/src/modules/community-packages/
# community-packages.service.ts on n8n-io/n8n) explicitly parses and accepts
# scoped names (`parseNpmPackageName` splits the `@scope/` prefix before
# checking for the `n8n-nodes-` prefix) when installed through that real
# flow - irrelevant to this script, which targets ~/.n8n/custom/ instead.
#
# Usage:   ./install_node.sh [path-to-tarball]
# Override the target user/directory with N8N_USER / N8N_CUSTOM_DIR env vars,
# e.g.: N8N_USER=n8n N8N_CUSTOM_DIR=/home/n8n/.n8n/custom ./install_node.sh
#
# Generalized (PACKAGE_DIR_NAME env var) so this script can be reused
# verbatim by any other self-developed node shipping to the same VPS.
# Canonical copy: ~/Documents/systems/n8n-node-package-skeleton/reference/install_to_custom.sh
set -e

N8N_USER="${N8N_USER:-$(whoami)}"
N8N_CUSTOM_DIR="${N8N_CUSTOM_DIR:-$HOME/.n8n/custom}"
PACKAGE_DIR_NAME="${PACKAGE_DIR_NAME:-Beehiiv}"
INSTALL_DIR="$N8N_CUSTOM_DIR/$PACKAGE_DIR_NAME"
TARBALL="${1:-/tmp/n8n-nodes-beehiiv.tar.gz}"

echo "Creating directory: $N8N_CUSTOM_DIR"
mkdir -p "$N8N_CUSTOM_DIR"
chown -R "$N8N_USER:$N8N_USER" "$N8N_CUSTOM_DIR" 2>/dev/null || true
echo "Removing old version if it exists..."
rm -rf "$INSTALL_DIR"
echo "Creating installation directory: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
echo "Extracting archive: $TARBALL"
# npm pack tarballs nest everything under a top-level "package/" directory -
# strip it so package.json/dist land directly at $INSTALL_DIR.
tar -xzvf "$TARBALL" -C "$INSTALL_DIR" --strip-components=1
echo "Fixing ownership/permissions for the n8n container user..."
# chown-by-name can't be trusted to match the container's runtime user (n8n
# typically runs as a non-root "node" uid inside Docker while this script
# runs as the host SSH user) - chmod to world-readable guarantees the files
# are readable regardless of any host/container uid mismatch.
chown -R "$N8N_USER:$N8N_USER" "$INSTALL_DIR" 2>/dev/null || true
chmod -R a+rX "$INSTALL_DIR"
echo "Restarting n8n to pick up the change (CustomDirectoryLoader scans at boot only)..."
docker restart n8n-n8n-1 2>/dev/null || echo "docker not available/reachable here - restart the n8n container manually."
echo "Installation complete. Verify by creating a disposable workflow referencing"
echo "type CUSTOM.beehiiv and confirming n8n resolves its credential requirements"
echo "instead of throwing 'Unrecognized node type'."
