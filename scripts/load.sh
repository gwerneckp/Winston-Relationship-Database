#!/bin/bash

data_dir=$(pwd)/data
backups_dir=$(pwd)/backups

docker run --interactive --tty --rm --volume=./data:/data --volume=./backups:/backups neo4j:4.4.20 neo4j-admin load --from=/backups/neo4j.dump --database=neo4j