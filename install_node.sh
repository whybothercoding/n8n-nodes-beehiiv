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
tar -xzvf "$TARBALL" -C "$INSTALL_DIR"
echo "Changing to directory: $INSTALL_DIR"
cd "$INSTALL_DIR"
echo "Installing production dependencies..."
npm install --production
echo "Installation complete."
