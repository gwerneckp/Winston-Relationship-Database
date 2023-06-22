#!/bin/bash

data_dir=$(pwd)/data
backups_dir=$(pwd)/backups

echo 'Temporarely turning off application'
docker-compose down

docker run --interactive --tty --rm --volume=./data:/data --volume=./backups:/backups neo4j:4.4.20 neo4j-admin load --from=/backups/neo4j.dump --database=neo4j --force
echo 'Turning application back on'
docker-compose up -d