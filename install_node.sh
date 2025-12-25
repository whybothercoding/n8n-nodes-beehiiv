#!/bin/bash
set -e
N8N_CUSTOM_DIR="/home/contact_indiegoweb_com/.n8n/custom"
INSTALL_DIR="$N8N_CUSTOM_DIR/n8n-nodes-beehiiv"
echo "Creating directory: $N8N_CUSTOM_DIR"
mkdir -p "$N8N_CUSTOM_DIR"
chown -R contact_indiegoweb_com:contact_indiegoweb_com "$N8N_CUSTOM_DIR"
echo "Removing old version if it exists..."
rm -rf "$INSTALL_DIR"
echo "Creating installation directory: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
echo "Extracting archive..."
tar -xzvf /tmp/n8n-nodes-beehiiv.tar.gz -C "$INSTALL_DIR"
echo "Changing to directory: $INSTALL_DIR"
cd "$INSTALL_DIR"
echo "Installing production dependencies..."
npm install --production
echo "Installation complete."
