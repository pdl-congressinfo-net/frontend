#!/bin/sh
set -e

: "${API_DATA_PROVIDER:?API_DATA_PROVIDER is not set}"

sed -i "s|__API_DATA_PROVIDER__|${API_DATA_PROVIDER}|g" \
  /app/dist/env.js

exec "$@"
