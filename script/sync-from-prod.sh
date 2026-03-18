#!/usr/bin/env bash
# Sync PRD data from the published (production) app into the local dev database.
# Usage: npm run sync-prod

PROD_URL="https://briefing-denim-city-website.replit.app"
DEV_URL="http://localhost:5000"
BACKUP_FILE="production-prd-backup.json"

echo "Fetching PRD data from production..."
curl -sf "$PROD_URL/api/prd" -o "$BACKUP_FILE"
if [ $? -ne 0 ]; then
  echo "ERROR: Could not fetch data from $PROD_URL/api/prd"
  exit 1
fi

SIZE=$(wc -c < "$BACKUP_FILE" | tr -d ' ')
echo "Downloaded $SIZE bytes → $BACKUP_FILE"

echo "Pushing to dev database..."
RESULT=$(curl -sf -X PUT "$DEV_URL/api/prd" -H "Content-Type: application/json" -d @"$BACKUP_FILE")
if [ $? -ne 0 ]; then
  echo "ERROR: Could not push data to $DEV_URL/api/prd — is the dev server running?"
  exit 1
fi

echo "Done! Dev database now matches production."
