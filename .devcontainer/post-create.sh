#!/bin/bash

# Install system dependencies
sudo apt-get update
sudo apt-get install -y libpcap-dev make

# Create .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

# Pre-build containers to save time
docker-compose build

echo "Codespace initialization complete. You can now run 'docker-compose up -d' to start the system."
