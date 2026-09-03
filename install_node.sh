#!/bin/bash
# Installs this node into a self-hosted n8n instance from a pre-built tarball
# (e.g. `npm pack`, renamed to n8n-nodes-beehiiv.tar.gz).
#
# IMPORTANT: this installs into ~/.n8n/nodes/node_modules/, NOT ~/.n8n/custom/.
# Those are two different, non-interchangeable loaders in n8n's own source
# (n8n-core's nodes-loader): anything placed directly under ~/.n8n/custom/ is
# picked up by CustomDirectoryLoader, which ignores package.json entirely and
# registers every node under a flat "CUSTOM.<node-name>" type (e.g.
# "CUSTOM.beehiiv"), NOT "@indiegoweb/n8n-nodes-beehiiv.beehiiv" - so it
# silently fails to match any workflow referencing the real community-node
# type name.
#
# The package is now scoped (@indiegoweb/n8n-nodes-beehiiv), because the
# unscoped name n8n-nodes-beehiiv is already taken on the npm registry by an
# unrelated package - confirmed 2026-08-25 via `npm view n8n-nodes-beehiiv`.
# n8n's CommunityPackagesService (packages/cli/src/modules/community-packages/
# community-packages.service.ts on n8n-io/n8n) explicitly parses and accepts
# scoped names (`parseNpmPackageName` splits the `@scope/` prefix before
# checking for the `n8n-nodes-` prefix), and installs to
# `<downloadDir>/node_modules/<packageName>` using the full scoped name as the
# path - so on disk this becomes .../node_modules/@indiegoweb/n8n-nodes-beehiiv/,
# same nesting npm itself uses. n8n's own source (read 2026-08-25, current
# master) still carries an open `// TODO: make sure that this works for scoped
# packages as well` right in that install path, but real-world confirmation
# beats the stale TODO: @splainez/n8n-nodes-phonenumber-parser is a live,
# 5-versions-in scoped community node on npm, and n8n-io/n8n#12071 shows a
# real user hitting the (generic, not scope-specific) "already loaded, delete
# the second copy" error at exactly the predicted path
# .../node_modules/@splainez/n8n-nodes-phonenumber-parser - which only fires
# after a prior successful install. Scoped packages install and load fine
# through the standard GUI/API path (Settings -> Community Nodes -> Install).
#
# EARLIER CLAIM CORRECTED (2026-08-25): a prior version of this comment said
# the community_packages module discovers packages by globbing
# ~/.n8n/nodes/node_modules/n8n-nodes-* via PackageDirectoryLoader. Reading
# n8n-io/n8n's current master source shows no such glob: CommunityPackagesService
# tracks installed packages in its own database table (installed_packages) and
# only (re)loads packages already recorded there - LoadNodesAndCredentials.init()
# does not scan this directory at boot. That may be genuine version drift from
# n8n 2.35.7 (what's actually deployed on the target VPS, and what was read
# directly off it at the time of the original claim) vs. current master, or it
# may mean a tarball dropped here by this script needs a matching
# installed_packages DB row to ever be picked up. Re-verify against the
# instance's actual n8n version before relying on this script - the officially
# supported path (Settings -> Community Nodes -> Install, or the
# POST /rest/community-packages API) always writes that DB row itself.
#
# Usage:   ./install_node.sh [path-to-tarball]
# Override the target user/directory with N8N_USER / N8N_NODES_DIR env vars,
# e.g.: N8N_USER=n8n N8N_NODES_DIR=/home/n8n/.n8n/nodes ./install_node.sh
#
# Generalized 2026-09-03 (PACKAGE_NAME env var) so this script can be reused
# verbatim by any other @indiegoweb/n8n-nodes-* package shipping to the same
# VPS the same way — defaults preserve this package's exact prior behavior.
# Canonical copy: ~/Documents/systems/n8n-node-package-skeleton/reference/install_node.sh
set -e

N8N_USER="${N8N_USER:-$(whoami)}"
N8N_NODES_DIR="${N8N_NODES_DIR:-$HOME/.n8n/nodes}"
NODE_MODULES_DIR="$N8N_NODES_DIR/node_modules"
PACKAGE_NAME="${PACKAGE_NAME:-@indiegoweb/n8n-nodes-beehiiv}"
INSTALL_DIR="$NODE_MODULES_DIR/$PACKAGE_NAME"
TARBALL="${1:-/tmp/n8n-nodes-beehiiv.tar.gz}"

echo "Creating directory: $NODE_MODULES_DIR"
mkdir -p "$NODE_MODULES_DIR"
chown -R "$N8N_USER:$N8N_USER" "$NODE_MODULES_DIR" 2>/dev/null || true
echo "Removing old version if it exists..."
rm -rf "$INSTALL_DIR"
echo "Creating installation directory: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
echo "Extracting archive: $TARBALL"
# npm pack tarballs nest everything under a top-level "package/" directory -
# strip it so package.json lands directly at $INSTALL_DIR (where
# PackageDirectoryLoader expects to find it), not one level too deep.
tar -xzvf "$TARBALL" -C "$INSTALL_DIR" --strip-components=1
echo "Changing to directory: $INSTALL_DIR"
cd "$INSTALL_DIR"
if command -v npm >/dev/null 2>&1; then
	echo "Installing production dependencies..."
	npm install --production
else
	echo "npm not found on this host - skipping (only needed if package.json declares runtime dependencies; n8n-workflow is a peer dep n8n provides itself)."
fi
echo "Fixing ownership/permissions for the n8n container user..."
# The chown above ran before extraction, so it never touched these new files.
# chown-by-name also can't be trusted to match the container's runtime user
# (n8n typically runs as a non-root "node" uid inside Docker while this script
# runs as the host SSH user) - chmod to world-readable guarantees the files
# are readable regardless of any host/container uid mismatch.
chown -R "$N8N_USER:$N8N_USER" "$INSTALL_DIR" 2>/dev/null || true
chmod -R a+rX "$INSTALL_DIR"
echo "Installation complete."
