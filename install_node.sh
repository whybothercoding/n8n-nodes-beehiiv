#!/bin/bash
# Installs this node into a self-hosted n8n instance's custom nodes directory
# from a pre-built tarball (e.g. `npm pack`, renamed to n8n-nodes-beehiiv.tar.gz).
#
# Usage:   ./install_node.sh [path-to-tarball]
# Override the target user/directory with N8N_USER / N8N_CUSTOM_DIR env vars,
# e.g.: N8N_USER=n8n N8N_CUSTOM_DIR=/home/n8n/.n8n/custom ./install_node.sh
set -e

N8N_USER="${N8N_USER:-$(whoami)}"
N8N_CUSTOM_DIR="${N8N_CUSTOM_DIR:-$HOME/.n8n/custom}"
INSTALL_DIR="$N8N_CUSTOM_DIR/n8n-nodes-beehiiv"
TARBALL="${1:-/tmp/n8n-nodes-beehiiv.tar.gz}"

echo "Creating directory: $N8N_CUSTOM_DIR"
mkdir -p "$N8N_CUSTOM_DIR"
chown -R "$N8N_USER:$N8N_USER" "$N8N_CUSTOM_DIR"
echo "Removing old version if it exists..."
rm -rf "$INSTALL_DIR"
echo "Creating installation directory: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
echo "Extracting archive: $TARBALL"
# npm pack tarballs nest everything under a top-level "package/" directory -
# strip it so package.json lands directly at $INSTALL_DIR (where n8n's
# custom-node loader expects to find it), not one level too deep.
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
