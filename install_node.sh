#!/bin/bash
# Installs this node into a self-hosted n8n instance from a pre-built tarball
# (e.g. `npm pack`, renamed to n8n-nodes-beehiiv.tar.gz).
#
# IMPORTANT: this installs into ~/.n8n/nodes/node_modules/, NOT ~/.n8n/custom/.
# Those are two different, non-interchangeable loaders in n8n's own source
# (n8n-core's nodes-loader): anything placed directly under ~/.n8n/custom/ is
# picked up by CustomDirectoryLoader, which ignores package.json entirely and
# registers every node under a flat "CUSTOM.<node-name>" type (e.g.
# "CUSTOM.beehiiv"), NOT "n8n-nodes-beehiiv.beehiiv" - so it silently fails to
# match any workflow referencing the real community-node type name. The
# community_packages module instead scans ~/.n8n/nodes/node_modules/n8n-nodes-*
# via PackageDirectoryLoader, which DOES read package.json's "n8n" field and
# preserves the package's own name as the type prefix - confirmed live
# 2026-08-25 by reading n8n 2.35.7's actual loader source on the target VPS,
# and by finding other working community nodes already installed there this
# exact way.
#
# Usage:   ./install_node.sh [path-to-tarball]
# Override the target user/directory with N8N_USER / N8N_NODES_DIR env vars,
# e.g.: N8N_USER=n8n N8N_NODES_DIR=/home/n8n/.n8n/nodes ./install_node.sh
set -e

N8N_USER="${N8N_USER:-$(whoami)}"
N8N_NODES_DIR="${N8N_NODES_DIR:-$HOME/.n8n/nodes}"
NODE_MODULES_DIR="$N8N_NODES_DIR/node_modules"
INSTALL_DIR="$NODE_MODULES_DIR/n8n-nodes-beehiiv"
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
