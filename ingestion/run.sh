#!/bin/sh

# Load default .env first
. .env

# Then override with NODE_ENV specific config if available
if [ -f "./config/$NODE_ENV.env" ]; then
  echo "Loading config/$NODE_ENV.env"
  . ./config/$NODE_ENV.env
fi

echo "Starting Node app on port $PORT..."
node dist/main.js
