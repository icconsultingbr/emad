#!/bin/bash
# This script is sourced by bash when it starts up.

cd /usr/share/nginx/html 

find . -type f -exec sed -i 's|e-atende|'$BASE_PATH'|g' {} \;

find . -type f -exec sed -i 's|:4001|:'$API_PORT'|g' {} \;

find . -type f -exec sed -i 's|api-eatende|'$API_NAME'|g' {} \;

nginx -g "daemon off;"
