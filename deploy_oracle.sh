#!/bin/bash

# Exit on error
set -e

echo "--- Installing Docker and Docker Compose ---"
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Setup user permissions
sudo usermod -aG docker $USER

echo "--- Preparing Project ---"
# Create .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

# Optimization for Oracle ARM (if applicable)
# Note: Some images like confluentinc/cp-kafka might need ARM specific tags
# if you chose an ARM A1 instance.

echo "--- Deployment Ready ---"
echo "Please log out and log back in for docker permissions to take effect."
echo "Then run: docker compose up -d"
