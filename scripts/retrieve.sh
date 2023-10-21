#!/bin/bash

set -e

cd src
mkdir -p ../backup
echo "Backing up current code..."
tar -czvf ../backup/backup-$(date +%s).tar.gz ./

# keep only the last 10 backups
echo "Pruning old backups"
ls -t ../backup/backup-*.tar.gz | tail -n +11 | xargs rm

echo "Retrieving code from Google..."
clasp pull